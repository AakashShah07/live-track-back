const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb+srv://aakashshah0707:VgwCYjIz7UnNCoMG@livetrackdb.4h6ua.mongodb.net/";

mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 }) // 5 sec timeout
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err.message));

// ✅ Define Schema & Model
const LocationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Location = mongoose.model("Location", LocationSchema);

// ✅ Store location updates
app.post("/api/update-location", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (latitude == null || longitude == null) {
      return res.status(400).json({ success: false, message: "Latitude and Longitude are required" });
    }

    await Location.create({ latitude, longitude });
    res.json({ success: true, message: "Location updated" });
  } catch (err) {
    console.error("Error saving location:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Fetch all locations (For tracking)
app.get("/api/get-locations", async (req, res) => {
  try {
    const locations = await Location.find().sort({ timestamp: -1 }); // Sort latest first
    res.json(locations);
  } catch (err) {
    console.error("Error fetching locations:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
