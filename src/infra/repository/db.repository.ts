import "dotenv/config";
import mongoose from "mongoose";
const { DB_URL } = process.env;

/*
Set to false to [disable buffering](http://mongoosejs.com/docs/faq.html#callback_never_executes) on all models associated with this connection.
    bufferCommands ?: boolean;
The name of the database you want to use. If not provided, Mongoose uses the database name from connection string.
    dbName ?: string;
username for authentication, equivalent to `options.auth.user`. Maintained for backwards compatibility.
    user ?: string;
password for authentication, equivalent to `options.auth.password`. Maintained for backwards compatibility.
    pass ?: string;
Set to false to disable automatic index creation for all models associated with this connection.
    autoIndex ?: boolean;
Set to `true` to make Mongoose automatically call `createCollection()` on every model created on this connection.
    autoCreate ?: boolean;
*/
const options = {
};

export const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        mongoose.connect(DB_URL!, options);
    } catch (err) {
        console.log("[X] · MongoDB NOT connected")
        console.log(err);
        //TODO start express 
        // startServer()
    }
}

mongoose.connection.on("connected", () => {
    console.log("[✔] · MongoDB connected")
    //TODO start express 
    // startServer();
});
mongoose.connection.on("error", (error) => {
    console.log(`[X] · Mongoose default connection has occured: ${error}`);
    process.exit();
});

mongoose.connection.on("disconnected", () => {
    console.log("[X] · MongoDB disconnected");
});

process.on("uncaughtException", () => {
    mongoose.disconnect();
});

const closeConnection = function () {
    mongoose.connection.close();
    console.log("[!] · MongoDB disconnected due to app termination");
};

process.on("SIGINT", closeConnection).on("SIGTERM", closeConnection);

export default connectDB;