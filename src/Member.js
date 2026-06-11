import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name:String,
  due:Number,
  paid:Number
});

export default mongoose.model("Member", schema);