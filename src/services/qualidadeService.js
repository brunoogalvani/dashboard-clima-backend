const fetch = require("node-fetch");
const API_KEY = "9cb6b1b2f42dc82345b394e85721c9059c153951";
const { safeEncode } = require("../utils/encode");

async function buscarQualidadeAr(cidade) {
  const cidadeEncoded = safeEncode(cidade);
  const url = `https://api.waqi.info/feed/${cidadeEncoded}/?token=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "ok") {
    throw new Error(data.data || "Erro ao buscar qualidade do ar");
  }

  const aqi = data.data.aqi;
  const info = data.data;

  return {
    cidade: info.city.name,
    aqi,
    dominancia: info.dominentpol,
    poluentes: info.iaqi
      ? Object.keys(info.iaqi).map((chave) => ({
          tipo: chave,
          valor: info.iaqi[chave].v,
        }))
      : [],
    hora_atualizada: info.time.s,
  };
}

module.exports = { buscarQualidadeAr };
