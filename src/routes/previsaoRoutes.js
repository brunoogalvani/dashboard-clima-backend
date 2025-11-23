const express = require('express');
const { getPrevisao } = require('../controllers/previsaoController.js');

const router = express.Router()

router.get('/previsao', getPrevisao);

module.exports = router;