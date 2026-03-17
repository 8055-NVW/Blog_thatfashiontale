import mongoose from "mongoose";
import { env } from "@/config/env";
import { ensureLikeIndexes } from "@/lib/mongooseIndexSync";

const connect = async() => {
    const connectionState = mongoose.connection.readyState

    if (connectionState === 1) {
        console.log("already connected");
        await ensureLikeIndexes();
        return;
    }
    if(connectionState === 2) {
        console.log("connecting...");
        return;
    }
    
    try {
        await mongoose.connect(env.MONGODB_URI!, {
            dbName: "next14blog",
            bufferCommands: true
        });
        await ensureLikeIndexes();
        console.log("connected!");
    } catch (error: unknown) {
        console.log("Error: ", error);
        throw error instanceof Error ? error : new Error("Error connecting to MongoDB")
    }
}

export default connect;
