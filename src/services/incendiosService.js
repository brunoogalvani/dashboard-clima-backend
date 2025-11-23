const axios = require("axios");
const Papa = require("papaparse");
const { getCoordenadasService } = require("./mapaService");

const FIRMS_CSV_URLS = [
  "https://firms.modaps.eosdis.nasa.gov/data/active_fire/modis-c6.1/csv/MODIS_C6_1_Global_24h.csv",
  "https://firms.modaps.eosdis.nasa.gov/data/active_fire/modis-c6/csv/MODIS_C6_24h.csv"
];

async function baixarCsvFirms() {
  let lastError = null;
  for (const url of FIRMS_CSV_URLS) {
    try {
      const r = await axios.get(url, { responseType: "text", timeout: 20000 });
      if (r.status === 200 && r.data) return r.data;
    } catch (err) {
      lastError = err;
      console.warn(`Falha ao baixar FIRMS CSV (${url}): ${err.message}`);
    }
  }
  throw lastError || new Error("Não foi possível baixar CSV FIRMS");
}

function construirBBox(lat, lon, delta = 2) {
  const latF = parseFloat(lat);
  const lonF = parseFloat(lon);
  return {
    latMin: latF - delta,
    latMax: latF + delta,
    lonMin: lonF - delta,
    lonMax: lonF + delta
  };
}

exports.buscarIncendiosPorCidade = async (cidade) => {
  try {
    const { lat, lon } = await getCoordenadasService(cidade);

    const csvText = await baixarCsvFirms();

    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    if (!parsed || !parsed.data) throw new Error("CSV inválido ou parse falhou");

    const bbox = construirBBox(lat, lon, 2);
    const nearby = parsed.data.filter((item) => {
      const latI = parseFloat(item.latitude);
      const lonI = parseFloat(item.longitude);
      if (Number.isNaN(latI) || Number.isNaN(lonI)) return false;
      return (
        latI >= bbox.latMin &&
        latI <= bbox.latMax &&
        lonI >= bbox.lonMin &&
        lonI <= bbox.lonMax
      );
    });

    const mapped = nearby.map((it) => ({
      latitude: it.latitude,
      longitude: it.longitude,
      brightness: it.brightness || it.bright_ti4 || it.bright_t31 || null,
      acq_date: it.acq_date,
      acq_time: it.acq_time,
      satellite: it.satellite || it.sat || null,
      confidence: it.confidence || it.confidence_level || null,
      frp: it.frp || null,
      version: it.version || null,
      type: it.type || null,
      daynight: it.daynight || null
    }));

    return {
      cidade,
      lat,
      lon,
      bbox,
      total_incendios: mapped.length,
      incendios: mapped.slice(0, 50),
      fonte: "NASA FIRMS (MODIS/VIIRS) - CSV"
    };
  } catch (err) {
    console.error("Erro no serviço NASA FIRMS:", err.response?.data || err.message || err);
    throw err;
  }
};
