const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

// ===== MongoDB =====
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ===== Schema =====
const MemberSchema = new mongoose.Schema({
  name: String,
  paid: { type: Number, default: 0 },
  due: { type: Number, default: 0 }
});

const EventSchema = new mongoose.Schema({
  title: String,
  date: String,
  price: Number,
  done: { type: Boolean, default: false }
});

const ExpenseSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  date: String
});

const Member = mongoose.model("Member", MemberSchema);
const Event = mongoose.model("Event", EventSchema);
const Expense = mongoose.model("Expense", ExpenseSchema);

// ===== ROUTES =====

// الصفحة الرئيسية (حل Cannot GET /)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===== Members =====
app.get("/members", async (req,res)=>{
  res.json(await Member.find());
});

app.post("/members", async (req,res)=>{
  const m = await Member.create(req.body);
  res.json(m);
});

app.delete("/members/:id", async (req,res)=>{
  await Member.findByIdAndDelete(req.params.id);
  res.json({ok:true});
});

// ===== Events =====
app.get("/events", async (req,res)=>{
  res.json(await Event.find());
});

app.post("/events", async (req,res)=>{
  const e = await Event.create(req.body);
  res.json(e);
});

app.put("/events/:id", async (req,res)=>{
  const e = await Event.findById(req.params.id);
  e.done = !e.done;
  await e.save();
  res.json(e);
});

// ===== Expenses =====
app.get("/expenses", async (req,res)=>{
  res.json(await Expense.find());
});

app.post("/expenses", async (req,res)=>{
  const ex = await Expense.create(req.body);
  res.json(ex);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log("Server running on " + PORT));