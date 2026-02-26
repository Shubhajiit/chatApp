require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./src/config/db');
const initSocket = require('./src/socket/socket');
const chatRoutes = require('./src/routes/chat.routes');
const errorMiddleware = require('./src/middleware/error.middleware');


const app = express();
const server = http.createServer(app);
initSocket(server);

//middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({limit: "5mb"}));
app.use(express.static('public'));

//routes
app.use('/api/chat', chatRoutes);

//health
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: "Server is healthy" });
});

//error middleware
app.use(errorMiddleware);
app.get("/", (req, res) => {
  res.send("Chat App Backend Running 🚀");
});


//DB + server start
connectDB().then(() => {
    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
        console.log(`🚀 Server running on port: http://localhost:${PORT}`);
        console.log(`🎮 Chat App is ready to use!`);
    });
}).catch(err => {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
});
    

// command to crate JWT token = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"