const fetch = require("node-fetch");
const { safeEncode } = require("../utils/encode");

async function buscarQualidadeAr(cidade) {
  const cidadeEncoded = safeEncode(cidade);
  const url = `https://api.waqi.info/feed/${cidadeEncoded}/?token=${process.env.QUALIDADE_API}`;
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

  const pols = [
    {
      "tipo": "co",
      "valor": info.iaqi.co?.v || null
    },
    {
      "tipo": "no2",
      "valor": info.iaqi.no2?.v || null
    },
    {
      "tipo": "o3",
      "valor": info.iaqi.o3?.v || null
    },
    {
      "tipo": "pm10",
      "valor": info.iaqi.pm10?.v || null
    },
    {
      "tipo": "pm25",
      "valor": info.iaqi.pm25?.v || null
    }
  ]

  return {
    cidade: info.city.name,
    aqi,
    dominancia: dominanciaFormatada,
    poluentes: pols.sort((a, b) => b.valor - a.valor),
    hora_atualizada: dateTimeFormatado
  };
}

module.exports = { buscarQualidadeAr };
