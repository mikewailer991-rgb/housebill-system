import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3001;

// Serve frontend build
const __dirname = new URL('.', import.meta.url).pathname;

app.use(express.static(path.join(__dirname, "../dist")));

// API route (example)
app.get("/api", (req, res) => {
  res.json({ message: "API working" });
});

// Catch all → send React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});