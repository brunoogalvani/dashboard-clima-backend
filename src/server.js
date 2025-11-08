const cors = require('cors');
const express = require('express');
const climaRoutes = require('./routes/climaRoutes.js');
const qualidadeRoutes = require('./routes/qualidadeRoutes.js');
const incendioRoutes = require("./routes/incendiosRoutes.js");
const mapaRoutes = require("./routes/mapaRoutes.js");

const app = express();

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use('/api', climaRoutes);
app.use('/api', qualidadeRoutes);
app.use('/api', incendioRoutes);
app.use("/api", mapaRoutes);

app.listen(3000, () => console.log('Middleware rodando na porta 3000'));
