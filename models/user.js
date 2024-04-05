import mongoose from "mongoose";
// Define your user schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

export default mongoose.model('User', userSchema);

