document.getElementById("summonButton").addEventListener("click", invokeOracle);

async function invokeOracle() {
  const input = document.getElementById("errorInput").value;
  const output = document.getElementById("oracleOutput");

  output.textContent = "Consulting the stars...";

  try {
    const response = await window.oracle.ask(input);
    output.textContent = response;
  } catch (err) {
    output.textContent = "⚠️ The Oracle was disturbed...";
    console.error(err);
  }
}