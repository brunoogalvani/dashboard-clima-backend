const axios = require("axios");
const { safeEncode } = require("../utils/encode");

// --- 1. Busca Coordenadas (Geocoding - Já existente) ---
async function getCoordenadasService(cidade) {
    try {
        const encodedCity = safeEncode(cidade);
        // Endpoint: /search?q={cidade}
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedCity}`;

        const response = await axios.get(url, {
            headers: { "User-Agent": "PIMA-Dashboard/1.0" },
        });

        const data = response.data;
        if (!data || data.length === 0) {
            throw new Error("Cidade não encontrada");
        }

        return {
            cidade,
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
        };
    } catch (error) {
        console.error("Erro no serviço Geocode:", error.message);
        throw new Error("Erro ao buscar coordenadas");
    }
}

//  Busca Nome da Cidade (Geocoding Reverso 
async function getReverseGeocodeService(lat, lon) {
    try {
        // Endpoint: /reverse?lat={lat}&lon={lon}
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`; 
        // Adicionamos zoom e addressdetails para melhor precisão

        const response = await axios.get(url, {
            headers: { "User-Agent": "PIMA-Dashboard/1.0" },
        });

        const data = response.data;
        if (!data || !data.address) {
            throw new Error("Localização não identificada.");
        }

        const address = data.address;
        
        // Tentamos extrair o nome da cidade usando a melhor opção disponível:
        // city > town > village > country (como último recurso)
        const cidade = address.city || address.town || address.village || address.county || data.display_name;
        const pais = address.country || "Desconhecido";

        return {
            cidade: cidade,
            pais: pais,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
        };
    } catch (error) {
        console.error("Erro no serviço Geocode Reverso:", error.message);
       
        return {
            cidade: "Local Desconhecido",
            pais: "Desconhecido",
            lat: parseFloat(lat),
            lon: parseFloat(lon),
        };
    }
}

module.exports = { 
    getCoordenadasService, 
    getReverseGeocodeService 
};