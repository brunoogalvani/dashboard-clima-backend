const { buscarIncendiosPorCidade } = require("../services/incendiosService");

exports.getIncendios = async (req, res) => {
  const { cidade } = req.query;
  if (!cidade) return res.status(400).json({ error: "A cidade é obrigatória." });

  try {
    const result = await buscarIncendiosPorCidade(cidade);
    // Retorna apenas a lista, para o frontend renderizar direto
    return res.json(result || []);
  } catch (err) {
    console.error("Erro no controller NASA FIRMS:", err.message);
    return res.status(500).json({ error: "Falha ao consultar a NASA FIRMS" });
  }
};
