const express = require("express");

const router = express.Router();

// Controller
const { handleLogin } = require("../../controllers/auth");

router.route("/").post(handleLogin);

module.exports = router;
