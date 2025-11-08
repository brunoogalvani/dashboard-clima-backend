const { getCoordenadasService } = require("../services/mapaService");

async function getCoordenadas(req, res) {
  const { cidade } = req.query;
  if (!cidade) {
    return res.status(400).json({ error: "Parâmetro 'cidade' é obrigatório." });
  }

  try {
    const coordenadas = await getCoordenadasService(cidade);
    res.json(coordenadas);
  } catch (error) {
    console.error("Erro no controller Geocode:", error.message);
    res.status(500).json({ error: "Falha ao buscar coordenadas." });
  }
}

module.exports = { getCoordenadas };
