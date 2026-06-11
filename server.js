import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// 📦 Schema
const MemberSchema = new mongoose.Schema({
  name: String,
  due: Number,
  paid: Number
});

const Member = mongoose.model("Member", MemberSchema);

// 🔥 API

// get all members
app.get("/api/members", async (req, res) => {
  const data = await Member.find();
  res.json(data);
});

// add member
app.post("/api/members", async (req, res) => {
  const newMember = new Member(req.body);
  await newMember.save();
  res.json(newMember);
});

// delete
app.delete("/api/members/:id", async (req, res) => {
  await Member.findByIdAndDelete(req.params.id);
  res.json({ message: "deleted" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));