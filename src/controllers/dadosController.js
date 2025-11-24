const { buscarDadosCompletos, buscarDadosPorCoordenadas } = require('../services/dadosService.js');

async function getDados(req, res) {
    try {
        const { cidade, lat, lon } = req.query; // Captura todos os parâmetros

        let resultado;

        // 1. Prioriza a busca por Coordenadas (Clique no mapa)
        if (lat && lon) {
            console.log(`[BACKEND] Buscando dados para Coordenadas: ${lat}, ${lon}`);
            // Chamaremos uma nova função (que criaremos no próximo passo)
            resultado = await buscarDadosPorCoordenadas(lat, lon); 
            
        } 
        // 2. Se não tem coordenadas, busca por cidade (Input de texto)
        else if (cidade) {
            console.log(`[BACKEND] Buscando dados para Cidade: ${cidade}`);
            resultado = await buscarDadosCompletos(cidade);
        }
        // 3. Se não tem nenhum parâmetro, usa um valor padrão
        else {
            console.log('[BACKEND] Buscando dados para Cidade Padrão: São Paulo');
            resultado = await buscarDadosCompletos('São Paulo');
        }

        res.status(200).json(resultado);

    } catch (error) {
        console.error('[BACKEND ERROR]:', error.message);
        res.status(500).json({erro: "Erro interno no servidor ao processar a requisição."});
    }
}

module.exports = {getDados};