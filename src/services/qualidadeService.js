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

  const dateTimeOriginal = info.time.s;
  const [date, hora] = dateTimeOriginal.split(" ");
  const horaFormatada = hora.slice(0,5);
  const dateTimeFormatado = `${date} ${horaFormatada}`
  
  let dominanciaFormatada;
  if (info.dominentpol === 'pm25') {
    dominanciaFormatada = 'pm2.5';
  } else {
    dominanciaFormatada = info.dominentpol;
  }

  const pols = ['co', 'no2', 'o3', 'pm10', 'pm25'];

  return {
    cidade: info.city.name,
    aqi,
    dominancia: dominanciaFormatada,
    poluentes: info.iaqi
      ? Object.keys(info.iaqi)
      .filter(chave => pols.includes(chave))
      .map((chave) => ({
          tipo: chave,
          valor: info.iaqi[chave].v,
        }))
      .sort((a, b) => b.valor - a.valor)
      : [],
    hora_atualizada: dateTimeFormatado
  };
}

module.exports = { buscarQualidadeAr };
