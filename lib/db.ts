import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async() => {
    const connectionState = mongoose.connection.readyState

    if (connectionState === 1) {
        console.log("already connected");
        return;
    }

    if(connectionState === 2) {
        console.log("connecting...");
        return;
    }

    try {
        mongoose.connect(MONGODB_URI!, {
            dbName: "next14blog",
            bufferCommands: true
        });
        console.log("connected!");
    } catch (error: any) {
        console.log("Error: ", error);
        throw new Error("Error: ", error)
    }
}

export default connect;