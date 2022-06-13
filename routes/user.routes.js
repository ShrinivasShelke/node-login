const express = require("express");
const loginController = require("../controllers/user.controller");
const router = express.Router();

router.post("/login", loginController.login);

module.exports = router;
