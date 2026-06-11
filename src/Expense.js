import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name:String,
  date:String,
  amount:Number
});

export default mongoose.model("Expense", schema);