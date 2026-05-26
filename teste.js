const { buscarHistoricoQualidade } = require("./src/services/qualidadeService.js");

(async () => {
  try {
    const r = await buscarHistoricoQualidade("São Paulo", 1);
    console.log("Pontos na série:", r.serie.length);
    console.log("Primeiro ponto:", r.serie[0]);
    console.log("Último ponto:", r.serie[r.serie.length - 1]);
  } catch (e) {
    console.error("Deu erro:", e.message);
  }
})();