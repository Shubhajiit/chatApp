const mongoose = require("mongoose");

module.exports = async() =>{
    const mongoUri = process.env.MONGO_URI?.trim();
    if (!mongoUri) {
        throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");

};