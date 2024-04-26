const express = require("express");
const router = express.Router();

// Controllers
const authController = require("../controllers/authController");

// Get - Render View
router.get("/login", authController.login);
router.get("/register", authController.register);
router.get("/logout", authController.logout);

// Post - Registering the users
router.post("/register", authController.registerPost);
router.post("/login", authController.loginPost);

module.exports = router;
