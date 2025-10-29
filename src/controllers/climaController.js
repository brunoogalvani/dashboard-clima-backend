const { buscarClima, buscarPrevisao } = require('../services/climaService.js');

async function getClima(req, res) {
    try {
        const cidade = req.query.cidade || 'Sao_Paulo';
        const resultado = await buscarClima(cidade);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({erro: error.message});
    }
}

async function getPrevisao(req, res) {
    try {
        const cidade = req.query.cidade || 'Sao_Paulo';
        const dias = req.query.dias || 3;
        const resultado = await buscarPrevisao(cidade, dias);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({erro: error.message});
    }
}

module.exports = { getClima, getPrevisao };
