const axios = require("axios");
const { safeEncode } = require("../utils/encode");

async function getCoordenadasService(cidade) {
  try {
    const encodedCity = safeEncode(cidade);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedCity}`;

    const response = await axios.get(url, {
      headers: { "User-Agent": "PIMA-Dashboard/1.0" }, // importante para evitar bloqueios
    });

    const data = response.data;
    if (!data || data.length === 0) {
      throw new Error("Cidade não encontrada");
    }

    return {
      cidade,
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  } catch (error) {
    console.error("Erro no serviço Geocode:", error.message);
    throw new Error("Erro ao buscar coordenadas");
  }
}

module.exports = { getCoordenadasService };
