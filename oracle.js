// Axios for communicating with the Oracle's backend
const axios = require("axios");

// Request wisdom from the cloud-based Oracle
async function askTheOracle(errorMessage) {
  try {
    // Send the mortal's question to the Oracle's temple (backend)
    const res = await axios.post(
      "https://erroracle-backend.onrender.com/oracle",
      {
        errorText: errorMessage,
      }
    );

    // Return the Oracle’s prophecy
    return res.data.message;
  } catch (err) {
    console.error("Oracle backend error:", err.message);
    // Respond gracefully if the Oracle cannot be reached
    return "🛑 The Oracle is unreachable. Check your connection or try again later.";
  }
}

// Export the Oracle function to be used by the main process
module.exports = { askTheOracle };