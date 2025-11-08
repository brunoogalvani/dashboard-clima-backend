const express = require("express");
const router = express.Router();
const { getCoordenadas } = require("../controllers/mapaController");

router.get("/geocode", getCoordenadas);

module.exports = router;
