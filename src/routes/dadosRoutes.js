const express = require('express');
const { getDados } = require('../controllers/dadosController');

const router = express.Router();

router.get('/dados', getDados);

module.exports = router;