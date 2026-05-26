const { buscarQualidadeAr, buscarHistoricoQualidade } = require("../services/qualidadeService.js");

async function getQualidadeAr(req, res) {
  try {
    const cidade = req.query.cidade || "São Paulo";
    const resultado = await buscarQualidadeAr(cidade);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}


async function getHistoricoQualidade(req, res) {
  try{
    const cidade = req.query.cidade || "São Paulo";
    const dias = Number(req.query.dias) || 1;
    const resultado = await buscarHistoricoQualidade(cidade, dias);
    res.status(200).json(resultado);
  }catch (error) {
    res.status(500).json({ erro: error.message});
  }
  
}
module.exports = { getQualidadeAr, getHistoricoQualidade };
