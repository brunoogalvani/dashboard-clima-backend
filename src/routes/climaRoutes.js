const express = require('express');
const { getClima, getPrevisao } = require('../controllers/climaController.js');

const router = express.Router();

router.get('/clima', getClima);
router.get('/previsao', getPrevisao);

module.exports = router;
