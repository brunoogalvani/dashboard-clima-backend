 const fetch = require("node-fetch");
  const { safeEncode } = require("../utils/encode");
  const cache = require('../utils/cache');

  async function buscarQualidadeAr(cidade) {
    const cacheKey = `qualidade:${cidade.toString().toLowerCase().trim()}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`[CACHE HIT] ${cacheKey}`);
      return cached;
    }

    const cidadeEncoded = safeEncode(cidade);
    const url = `https://api.waqi.info/feed/${cidadeEncoded}/?token=${process.env.QUALIDADE_API}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error(data.data || "Erro ao buscar qualidade do ar");
    }

    const info = data.data;
    const [date, hora] = info.time.s.split(" ");
    const dateTimeFormatado = `${date} ${hora.slice(0,5)}`;

    const dominanciaFormatada = info.dominentpol === 'pm25' ? 'pm2.5' : info.dominentpol;

    const pols = [
      { tipo: "co",   valor: info.iaqi.co?.v   || null },
      { tipo: "no2",  valor: info.iaqi.no2?.v  || null },
      { tipo: "o3",   valor: info.iaqi.o3?.v   || null },
      { tipo: "pm10", valor: info.iaqi.pm10?.v || null },
      { tipo: "pm25", valor: info.iaqi.pm25?.v || null }
    ];

    const resultado = {
      cidade: info.city.name,
      aqi: info.aqi,
      dominancia: dominanciaFormatada,
      poluentes: pols.sort((a, b) => b.valor - a.valor),
      hora_atualizada: dateTimeFormatado
    };

    cache.set(cacheKey, resultado, 1800);
    return resultado;
  }

  module.exports = { buscarQualidadeAr };