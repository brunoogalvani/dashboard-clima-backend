const fetch = require('node-fetch');
  const { getCoordenadasService } = require('./mapaService');
  const cache = require('../utils/cache');

  async function buscarPrevisao(input) {
      let lat, lon;

      if (typeof input === "string") {
          const coords = await getCoordenadasService(input);
          lat = coords.lat;
          lon = coords.lon;
      } else if (typeof input === "object" && input.lat && input.lon) {
          lat = input.lat;
          lon = input.lon;
      } else {
          throw new Error("Parâmetros inválidos para busca de previsão.");
      }

      const cacheKey = `previsao:${lat.toFixed(3)},${lon.toFixed(3)}`;
      const cached = cache.get(cacheKey);
      if (cached) {
          console.log(`[CACHE HIT] ${cacheKey}`);
          return cached;
      }

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&forecast_days=16&timezone=aut
  o&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunset,sunrise`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) throw new Error(data.error.message);

      const dias = data.daily.time.map((_, i) => ({
          data: data.daily.time[i],
          temperatura_max: data.daily.temperature_2m_max[i],
          temperatura_min: data.daily.temperature_2m_min[i],
          probabilidade_chuva: data.daily.precipitation_probability_max[i],
          nascer_do_sol: data.daily.sunrise[i].split("T")[1],
          por_do_sol: data.daily.sunset[i].split("T")[1]
      }));

      const resultado = { dias: dias.slice(1) };

      cache.set(cacheKey, resultado, 3600);
      return resultado;
  }

  module.exports = { buscarPrevisao };