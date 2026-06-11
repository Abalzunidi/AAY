import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title:String,
  date:String,
  price:Number,
  done:{type:Boolean,default:false}
});

export default mongoose.model("Event", schema);