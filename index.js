const express = require("express");
const app = express();

let version = "1.0.0";

app.get("/version", (req, res) => {
  res.json({ version });
});

// Simulate version change after 15 sec
setTimeout(() => {
  version = "1.1.0";
  console.log("Version updated");
}, 15000);


let message = null;

app.get("/updates", (req, res) => {
  console.log("Client connected");

  const interval = setInterval(() => {
    if (message) {
      res.json({ message });

      message = null;
      clearInterval(interval);
    }
  }, 1000);

  // Timeout after 30 sec
  req.on("close", () => {
    clearInterval(interval);
  });
});

// Simulate new data after 10 sec
setTimeout(() => {
  message = "New Notification!";
  console.log("New data available");
}, 10000);

app.listen(3005, () => {
  console.log("Server running on port 3005");
});