const axios = require("axios");
  const { safeEncode } = require("../utils/encode");
  const cache = require("../utils/cache");

  async function getCoordenadasService(cidade) {
      const cacheKey = `geo:${cidade.toLowerCase().trim()}`;
      const cached = cache.get(cacheKey);
      if (cached) {
          console.log(`[CACHE HIT] ${cacheKey}`);
          return cached;
      }

      try {
          const encodedCity = safeEncode(cidade);
          const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedCity}`;

          const response = await axios.get(url, {
              headers: { "User-Agent": "PIMA-Dashboard/1.0" },
          });

          const data = response.data;
          if (!data || data.length === 0) {
              throw new Error("Cidade não encontrada");
          }

          const resultado = {
              cidade,
              lat: parseFloat(data[0].lat),
              lon: parseFloat(data[0].lon),
          };

          cache.set(cacheKey, resultado, 86400); // 24h
          return resultado;
      } catch (error) {
          console.error("Erro no serviço Geocode:", error.message);
          throw new Error("Erro ao buscar coordenadas");
      }
  }

  async function getReverseGeocodeService(lat, lon) {
      const latF = parseFloat(lat);
      const lonF = parseFloat(lon);
      const cacheKey = `reverse:${latF.toFixed(3)},${lonF.toFixed(3)}`;
      const cached = cache.get(cacheKey);
      if (cached) {
          console.log(`[CACHE HIT] ${cacheKey}`);
          return cached;
      }

      try {
          const url =
  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;

          const response = await axios.get(url, {
              headers: { "User-Agent": "PIMA-Dashboard/1.0" },
          });

          const data = response.data;
          if (!data || !data.address) {
              throw new Error("Localização não identificada.");
          }

          const address = data.address;
          const cidade = address.city || address.town || address.village || address.county || data.display_name;
          const pais = address.country || "Desconhecido";

          const resultado = {
              cidade,
              pais,
              lat: latF,
              lon: lonF,
          };

          cache.set(cacheKey, resultado, 86400); // 24h
          return resultado;
      } catch (error) {
          console.error("Erro no serviço Geocode Reverso:", error.message);
          return {
              cidade: "Local Desconhecido",
              pais: "Desconhecido",
              lat: latF,
              lon: lonF,
          };
      }
  }

  module.exports = {
      getCoordenadasService,
      getReverseGeocodeService
  };