const { buscarDadosCompletos } = require('../services/dadosService.js');

async function getDados(req, res) {
    try {
        const cidade = req.query.cidade || 'São Paulo';
        const resultado = await buscarDadosCompletos(cidade);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({erro: error.message});
    }
}

module.exports = {getDados};