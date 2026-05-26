const express = require("express");
const { getQualidadeAr, getHistoricoQualidade } = require("../controllers/qualidadeController.js");

const router = express.Router();

router.get("/qualidade", getQualidadeAr);
router.get("/qualidade/historico", getHistoricoQualidade);

module.exports = router;
