const { buscarQualidadeAr } = require("../services/qualidadeService.js");

async function getQualidadeAr(req, res) {
  try {
    const cidade = req.query.cidade || "São Paulo";
    const resultado = await buscarQualidadeAr(cidade);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

module.exports = { getQualidadeAr };
