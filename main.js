import express from 'express';
import fetch from 'node-fetch';

const app = express();
const API_KEY = 'acac7a3616df457d8f711550252810';

app.get('/api/clima', async (req, res) => {
  try {
    const cidade = req.query.cidade || 'Sao_Paulo';
    const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cidade}&lang=pt`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ erro: data.error.message });
    }

    let isDay = false;
    if (data.current.is_day==1) {
        isDay = true;
    }

    // tratamento — devolve só o que o front precisa
    const resultado = {
      cidade: data.location.name,
      pais: data.location.country,
      temperatura: data.current.temp_c,
      dia: isDay,
      sensacao: data.current.feelslike_c,
      condicao: data.current.condition.text,
      umidade: data.current.humidity,
      vento_kph: data.current.wind_kph,
      icone: `https:${data.current.condition.icon}`,
      atualizado_em: data.current.last_updated
    };

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao consultar a API de clima.' });
  }
});

app.listen(3000, () => console.log('Middleware rodando na porta 3000'));