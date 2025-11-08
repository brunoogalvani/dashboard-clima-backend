const express = require("express");
const router = express.Router();
const { getIncendios } = require("../controllers/incendiosController");

router.get("/incendios", getIncendios);

module.exports = router;
