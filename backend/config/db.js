import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://rrssbusiness2024:RRSS2024@cluster0.if7dxpv.mongodb.net/foody').then(()=>console.log("DB Connected"));
}