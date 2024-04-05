import mongoose from "mongoose";
export default async function connect(){
    await mongoose.connect('mongodb://0.0.0.0:27017/coursesDB', { useNewUrlParser: true,
    useUnifiedTopology: true })
    console.log("Database Connected")
}