const { getCoordenadasService } = require("./mapaService");
const { buscarClima } = require("./climaService");
const { buscarQualidadeAr } = require("./qualidadeService");
const { buscarIncendiosPorCidade } = require("./incendiosService");
const { buscarPrevisao } = require("./previsaoService");

async function buscarDadosCompletos(cidade) {
  const { lat, lon } = await getCoordenadasService(cidade);

  const resultados = await Promise.allSettled([
    buscarClima(`${lat},${lon}`),
    buscarPrevisao(cidade),
    buscarQualidadeAr(cidade),
    buscarIncendiosPorCidade(`${lat},${lon}`)
  ]);

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

async function buscarDadosPorCoordenadas(lat, lon) {
    let cidadeDoClique = "Localização Selecionada";
    let paisDoClique = "Desconhecido";
    
    // 1. Geocoding Reverso: Obter o nome da cidade a partir das coordenadas
    try {
        const geoResultado = await getReverseGeocodeService(lat, lon);
        cidadeDoClique = geoResultado.cidade; // Assume que o serviço retorna { cidade, pais }
        paisDoClique = geoResultado.pais;
    } catch (error) {
        console.warn(`[REVERSE GEOCODE] Não foi possível obter o nome da cidade: ${error.message}`);
        // Continua com os valores padrão se falhar
    }

    // 2. Executa as buscas simultâneas
    // Note que passamos 'cidadeDoClique' para previsao e qualidade, e 'lat,lon' para clima e incendios.
    const resultados = await Promise.allSettled([
        buscarClima(`${lat},${lon}`),
        buscarPrevisao(cidadeDoClique),
        buscarQualidadeAr(cidadeDoClique),
        buscarIncendiosPorCidade(`${lat},${lon}`)
    ]);

    // 3. Monta o resultado (mesma lógica de Promise.allSettled)
    const clima = resultados[0].status === "fulfilled" ? resultados[0].value : { erro: resultados[0].reason?.message || "Erro ao buscar clima" };
    const previsao = resultados[1].status === "fulfilled" ? resultados[1].value : { erro: resultados[1].reason?.message || "Erro ao buscar previsão" };
    const qualidade = resultados[2].status === "fulfilled" ? resultados[2].value : { erro: resultados[2].reason?.message || "Erro ao buscar qualidade do ar" };
    const incendios = resultados[3].status === "fulfilled" ? resultados[3].value : { erro: resultados[3].reason?.message || "Erro ao buscar incêndios" };

    return {
        // O nome da cidade é o que veio do geocoding reverso
        cidade: clima.cidade || cidadeDoClique, 
        pais: clima.pais || paisDoClique,
        lat: parseFloat(lat), // Garante que seja um número (se vier como string de query)
        lon: parseFloat(lon),
        clima,
        previsao,
        qualidade,
        incendios
    };
}

module.exports = { buscarDadosCompletos, buscarDadosPorCoordenadas };
