const express = require("express");
const router = express.Router();

// helper
const checkAuth = require("../helpers/auth").checkAuth;

// Controller
const toughtController = require("../controllers/toughtController");

router.get("/add", checkAuth, toughtController.createTought);
router.get("/dashboard", checkAuth, toughtController.dashboard);
router.get("/", toughtController.showToughts);
router.get("/edit/:id", checkAuth, toughtController.updateTought);

// Post
router.post("/add", checkAuth, toughtController.createToughtSave);
router.post("/remove", checkAuth, toughtController.removeTought);
router.post("/edit", checkAuth, toughtController.updateToughtSave);

module.exports = router;
