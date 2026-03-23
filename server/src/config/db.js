import mongoose from "mongoose";

export async function connectDb(){
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("connected to database");
}