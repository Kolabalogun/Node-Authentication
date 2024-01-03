const express = require("express");

const path = require("path");

const app = express();

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

app.get("/about(.html)?", (req, res) => {
  res.sendFile("../views/about.html", { root: __dirname });
});

module.exports = router;
