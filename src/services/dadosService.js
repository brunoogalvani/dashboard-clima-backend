const { getCoordenadasService } = require("./mapaService");
const { buscarClima } = require("./climaService");
const { buscarQualidadeAr } = require("./qualidadeService");
const { buscarIncendiosPorCidade } = require("./incendiosService");
const { buscarPrevisao } = require("./previsaoService");

async function buscarDadosCompletos(cidade) {
  const { lat, lon } = await getCoordenadasService(cidade);

  // executa todas em paralelo, mas sem quebrar se uma falhar
  const resultados = await Promise.allSettled([
    buscarClima(`${lat},${lon}`),
    buscarPrevisao(cidade),
    buscarQualidadeAr(cidade),
    buscarIncendiosPorCidade(`${lat},${lon}`)
  ]);

  // extrai cada resultado com fallback
  const clima = resultados[0].status === "fulfilled" ? resultados[0].value : { erro: resultados[0].reason?.message || "Erro ao buscar clima" };
  const previsao = resultados[1].status === "fulfilled" ? resultados[1].value : { erro: resultados[1].reason?.message || "Erro ao buscar previsão" };
  const qualidade = resultados[2].status === "fulfilled" ? resultados[2].value : { erro: resultados[2].reason?.message || "Erro ao buscar qualidade do ar" };
  const incendios = resultados[3].status === "fulfilled" ? resultados[3].value : { erro: resultados[3].reason?.message || "Erro ao buscar incêndios" };

  return {
    cidade: clima.cidade || cidade,
    pais: clima.pais || "Desconhecido",
    lat,
    lon,
    clima,
    previsao,
    qualidade,
    incendios
  };
}

module.exports = { buscarDadosCompletos };
