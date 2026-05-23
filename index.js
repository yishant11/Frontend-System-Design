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

app.listen(3005, () => {
  console.log("Server running on port 3005");
});