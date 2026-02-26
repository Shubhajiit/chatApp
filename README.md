# 💬 Real-Time Chat Application

A modern, full-featured real-time chat application built with Node.js, Express, Socket.io, and MongoDB.

## 🌟 Features

- **Real-time messaging** with Socket.io
- **User management** with simple username-based authentication
- **Online users list** showing who's currently active
- **Message history** stored in MongoDB
- **Responsive design** with modern UI/UX
- **Auto-scroll** to latest messages
- **Message timestamps** for better chat experience
- **Clean and intuitive interface**
- **Cross-browser compatibility**

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Real-time Communication**: Socket.io
- **Environment Management**: dotenv

## 📁 Project Structure

```
chatApp/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── README.md              # Project documentation
├── public/                # Frontend files
│   ├── index.html        # Main HTML file
│   ├── index.js          # Client-side JavaScript
│   └── style.css         # CSS styles
└── src/
    ├── config/
    │   └── db.js          # Database connection
    ├── models/            # Mongoose models
    │   ├── chat.model.js  # Chat message model
    │   ├── thread.model.js # Chat thread model
    │   └── User.js        # User model
    ├── routes/
    │   └── chat.routes.js # Chat API routes
    ├── controller/
    │   └── chat.controller.js # Chat logic
    ├── middleware/
    │   └── error.middleware.js # Error handling
    ├── socket/
    │   └── socket.js      # Socket.io setup
    └── utils/
        └── asyncHandler.js # Async error handling
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd chatApp
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key_here
```

4. **Start the application**

For development (with auto-restart):
```bash
npm run dev
```

For production:
```bash
npm start
```

5. **Open your browser**
Navigate to `http://localhost:8000`

## 💾 Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Get your connection string
5. Replace `your_mongodb_connection_string` in `.env` file

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service: `mongod`
3. Use connection string: `mongodb://localhost:27017/chatapp`

## 📱 How to Use

1. **Enter your username** on the login screen
2. **Click "Join Chat"** to connect to the chat server
3. **View online users** in the sidebar
4. **Select a user** from the online users list to start a conversation
5. **Type your message** and press Enter or click Send
6. **Enjoy real-time messaging** with other connected users!

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/send` | Send a new message |
| GET | `/api/chat/conversation/:sender/:receiver` | Get conversation between two users |
| GET | `/api/chat/users/online` | Get list of currently online users |
| GET | `/api/health` | Server health check |

## 🌐 Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join` | Client → Server | User joins the chat |
| `new_message` | Server → Client | Real-time message delivery |
| `user_connected` | Server → Client | User comes online |
| `user_disconnected` | Server → Client | User goes offline |

## 🎨 Customization

### Styling
- Modify `public/style.css` to change the UI appearance
- Colors, gradients, and layout can be easily customized
- Responsive design works on mobile and desktop

### Backend Features
- Add user authentication in `src/models/User.js`
- Implement file sharing in chat controller
- Add message encryption for enhanced security
- Create chat rooms/groups functionality

## 🐛 Troubleshooting

### Common Issues

1. **Database connection fails**
   ```
   Error: Failed to connect to MongoDB
   ```
   - Check your MongoDB URI in `.env`
   - Ensure MongoDB service is running
   - Verify network connectivity

2. **Socket connection issues**
   ```
   Socket.io connection failed
   ```
   - Verify the server port in `public/index.js`
   - Check firewall settings
   - Ensure CORS is properly configured

3. **Messages not delivering**
   - Check browser console for JavaScript errors
   - Verify API endpoints are responding
   - Test with multiple browser tabs

4. **Port already in use**
   ```
   Error: listen EADDRINUSE :::8000
   ```
   - Change PORT in `.env` file
   - Kill the process using the port: `lsof -ti:8000 | xargs kill`

## 🔄 Development Scripts

```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Socket.io team for excellent real-time communication library
- MongoDB team for the robust database solution
- Express.js community for the amazing web framework

---

**Happy Chatting! 💬✨**

*Built with ❤️ using Node.js and modern web technologies*
