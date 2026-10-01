import mongoose from "mongoose";
let isConnected = false;
const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState === 1) {
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        if (process.env.NODE_ENV !== "production") {
            process.exit(1);
        }
    }
};
export default connectDB;
