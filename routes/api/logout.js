const express = require("express");

const router = express.Router();

// Controller
const { handleLogout } = require("../../controllers/logout");

router.route("/").get(handleLogout);

module.exports = router;
