const cors = require('cors');
const express = require('express');
const climaRoutes = require('./routes/climaRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173'
}));



app.use('/api', climaRoutes);

app.listen(3000, () => console.log('Middleware rodando na porta 3000'));
