const cors = require('cors');
const express = require('express');
const climaRoutes = require('./routes/climaRoutes.js');
const qualidadeRoutes = require('./routes/qualidadeRoutes.js');
const incendioRoutes = require('./routes/incendiosRoutes.js');
const mapaRoutes = require('./routes/mapaRoutes.js');
const previsaoRoutes = require('./routes/previsaoRoutes.js');
const dadosRoutes = require('./routes/dadosRoutes.js')
const dotenv = require('dotenv');

dotenv.config()

const app = express();

app.use(cors({
  origin: ['https://pima-backend.vercel.app','http://localhost:5173']
}));

app.use('/api', climaRoutes);
app.use('/api', qualidadeRoutes);
app.use('/api', incendioRoutes);
app.use("/api", mapaRoutes);
app.use("/api", previsaoRoutes);
app.use("/api", dadosRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => console.log('Middleware rodando na porta 3000'));
}

module.exports = app;
