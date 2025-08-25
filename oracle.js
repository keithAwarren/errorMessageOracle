// Axios for communicating with the Oracle's backend
const axios = require("axios");

// Request wisdom from the cloud-based Oracle
async function askTheOracle(errorMessage, signal) {
  try {
    // Send the mortal's question to the Oracle's temple (backend)
    const res = await axios.post(
      "https://erroracle-backend.onrender.com/oracle",
      { errorText: errorMessage },
      { signal } // Use the AbortSignal to allow cancellation
    );

    // Return the Oracle’s prophecy
    return res.data.message;
  } catch (err) {
    // Let aborts bubble (main will translate to ABORTED)
    const msg = String((err && (err.code || err.name || err.message)) || "");
    if (
      /ERR_CANCELED/i.test(msg) ||
      /CanceledError/i.test(msg) ||
      /aborted|canceled/i.test(msg)
    ) {
      throw err;
    }

    console.error("Oracle backend error:", err.message || err);
    // Respond gracefully if the Oracle cannot be reached
    return "🛑 The Oracle is unreachable. Check your connection or try again later.";
  }
}

module.exports = { askTheOracle };