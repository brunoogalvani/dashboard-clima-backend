const fetch = require('node-fetch');
const API_KEY = 'acac7a3616df457d8f711550252810';
const { safeEncode } = require("../utils/encode");

async function buscarClima(cidade) {
    const cidadeEncoded = safeEncode(cidade);
    const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cidadeEncoded}&aqi=yes&lang=pt`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    return {
        cidade: data.location.name,
        pais: data.location.country,
        temperatura: data.current.temp_c,
        dia: data.current.is_day === 1,
        sensacao: data.current.feelslike_c,
        condicao: data.current.condition.text,
        umidade: data.current.humidity,
        vento_kph: data.current.wind_kph,
        icone: `https:${data.current.condition.icon}`,
        atualizado_em: data.current.last_updated,
        qualidade_ar: {
            epa: data.current.air_quality["us-epa-index"],
            defra: data.current.air_quality["gb-defra-index"]
        }
    }
}

async function buscarPrevisao(cidade, dias) {
    const limiteDias = Math.min(Math.max(parseInt(dias), 1), 14);
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cidade}&days=${dias}&lang=pt`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    const previsao = data.forecast.forecastday.map(dia => ({
        data: dia.date,
        temp_min: dia.day.mintemp_c,
        temp_max: dia.day.maxtemp_c,
        condicao: dia.day.condition.text,
        icone: `https:${dia.day.condition.icon}`,
        chance_chuva: dia.day.daily_chance_of_rain,
        umidade: dia.day.avghumidity,
        horas: dia.hour.map(h => ({
            hora: h.time.split(' ')[1],
            temp_c: h.temp_c,
            condicao: h.condition.text,
            icone: `https:${h.condition.icon}`,
            chance_chuva: h.chance_of_rain,
            umidade: h.humidity,
            vento_kph: h.wind_kph
        }))
    }));

    return {
        cidade: data.location.name,
        pais: data.location.country,
        atualizado_em: data.current.last_updated,
        dias: previsao
    }
}

module.exports = { buscarClima, buscarPrevisao };
