import mongoose from "mongoose";
import { env } from "@/config/env";

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
        mongoose.connect(env.MONGODB_URI!, {
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