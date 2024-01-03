const express = require("express");

const app = express();

const router = express.Router();

const path = require("path");

router.get("/", (req, res) => {
  res.sendFile("../views/subdir/index.html", { root: __dirname });
});

module.exports = router;
