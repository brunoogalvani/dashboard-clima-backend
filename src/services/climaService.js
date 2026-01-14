const fetch = require('node-fetch');
const { getCoordenadasService } = require('./mapaService');

async function buscarClima(cidade) {
    const { lat, lon } = await getCoordenadasService(cidade);
    const url = `http://api.weatherapi.com/v1/current.json?key=${process.env.CLIMA_API}&q=${lat},${lon}&aqi=yes&lang=pt`;
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
        fuso_horario: data.location.tz_id
    }
}

module.exports = { buscarClima };
