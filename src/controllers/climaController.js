const { buscarClima, buscarPrevisao } = require('../services/climaService.js');

async function getClima(req, res) {
    try {
        const cidade = req.query.cidade || 'São Paulo';
        const resultado = await buscarClima(cidade);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({erro: error.message});
    }
}

async function getPrevisao(req, res) {
    try {
        const cidade = req.query.cidade || 'São Paulo';
        const dias = req.query.dias || 3;

        if (dias < 1 || dias > 14) return res.status(400).json({erro: "Digite um limite de dias válido (Entre 1 e 14)"})

        const resultado = await buscarPrevisao(cidade, dias);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({erro: error.message});
    }
}

module.exports = { getClima, getPrevisao };
