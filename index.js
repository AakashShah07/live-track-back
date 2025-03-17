const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB (Replace with your connection string)
mongoose.connect("mongodb+srv://aakashshah0707:VgwCYjIz7UnNCoMG@livetrackdb.4h6ua.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ✅ Define Schema & Model
const LocationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
});
const Location = mongoose.model("Location", LocationSchema);

// ✅ Store location updates
app.post("/api/update-location", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    await Location.create({ latitude, longitude });
    res.json({ success: true, message: "Location updated" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Fetch all locations (For tracking)
app.get("/api/get-locations", async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
