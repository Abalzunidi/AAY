import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// __dirname fix ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

// ===== MongoDB =====
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// ===== Schemas =====
const Member = mongoose.model("Member", new mongoose.Schema({
  name: String,
  paid: { type: Number, default: 0 },
  due: { type: Number, default: 0 }
}));

const Event = mongoose.model("Event", new mongoose.Schema({
  title: String,
  date: String,
  price: Number,
  done: { type: Boolean, default: false }
}));

const Restaurant = mongoose.model("Restaurant", new mongoose.Schema({
  name: String,
  date: String,
  price: Number,
  done: { type: Boolean, default: false }
}));

const Expense = mongoose.model("Expense", new mongoose.Schema({
  name: String,
  amount: Number,
  date: String
}));

// ===== ROOT (حل Cannot GET /) =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===== MEMBERS =====
app.get("/members", async (req, res) => res.json(await Member.find()));
app.post("/members", async (req, res) => res.json(await Member.create(req.body)));
app.delete("/members/:id", async (req, res) => {
  await Member.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// ===== EVENTS =====
app.get("/events", async (req, res) => res.json(await Event.find()));
app.post("/events", async (req, res) => res.json(await Event.create(req.body)));

app.put("/events/:id", async (req, res) => {
  const e = await Event.findById(req.params.id);
  e.done = !e.done;
  await e.save();
  res.json(e);
});

// ===== RESTAURANTS =====
app.get("/restaurants", async (req, res) => res.json(await Restaurant.find()));
app.post("/restaurants", async (req, res) => res.json(await Restaurant.create(req.body)));

app.put("/restaurants/:id", async (req, res) => {
  const r = await Restaurant.findById(req.params.id);
  r.done = !r.done;
  await r.save();
  res.json(r);
});

// ===== EXPENSES =====
app.get("/expenses", async (req, res) => res.json(await Expense.find()));
app.post("/expenses", async (req, res) => res.json(await Expense.create(req.body)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));