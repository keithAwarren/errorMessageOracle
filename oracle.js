const axios = require("axios");

async function askTheOracle(errorMessage) {
  try {
    const res = await axios.post("http://localhost:3000/oracle", {
      errorText: errorMessage,
    });
    return res.data.message;
  } catch (err) {
    console.error("Oracle backend error:", err.message);
    return "🛑 The Oracle is unreachable. Check your connection or try again later.";
  }
}

module.exports = { askTheOracle };