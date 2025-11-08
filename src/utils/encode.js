function safeEncode(text) {
  if (!text) return "";
  try {
    return encodeURIComponent(text.trim());
  } catch (err) {
    console.warn("Falha ao codificar texto:", text, err);
    return text;
  }
}

module.exports = { safeEncode };
