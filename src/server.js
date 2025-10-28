const express = require('express');
const climaRoutes = require('./routes/climaRoutes');

const app = express();

app.use('/api', climaRoutes);

app.listen(3000, () => console.log('Middleware rodando na porta 3000'));
