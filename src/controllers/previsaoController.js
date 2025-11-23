const { buscarPrevisao } = require('../services/previsaoService.js');

async function getPrevisao(req, res) {
    try {
        const cidade = req.query.cidade || 'São Paulo';

        if (!cidade) return res.status(400).json({ error: "A cidade é obrigatória." });

        const previsao = await buscarPrevisao(cidade);
        return res.status(200).json(previsao)
    } catch (error) {
        return res.status(500).json({erro: error.message});
    }
}

module.exports = { getPrevisao };