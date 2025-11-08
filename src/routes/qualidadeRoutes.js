const express = require("express");
const { getQualidadeAr } = require("../controllers/qualidadeController.js");

const router = express.Router();

router.get("/qualidade", getQualidadeAr);

module.exports = router;
