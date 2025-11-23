const express = require('express');
const { getClima } = require('../controllers/climaController.js');

const router = express.Router();

router.get('/clima', getClima);

module.exports = router;
