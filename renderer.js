// Listen for clicks on the "Summon Oracle" button
document.getElementById("summonButton").addEventListener("click", invokeOracle);

// Invoke the Oracle to interpret the user's error
async function invokeOracle() {
  const input = document.getElementById("errorInput").value; // Retrieve the mortal's plea
  const output = document.getElementById("oracleOutput"); // Target area for the Oracle’s reply

  output.classList.remove("oracle-revealed");
  output.textContent = "Consulting the stars..."; // Display a waiting message while the Oracle listens

  try {
    const response = await window.oracle.ask(input); // Ask the Oracle (through the preload bridge)
    output.textContent = response; // Reveal the Oracle’s wisdom

    void output.offsetWidth;
    output.classList.add("oracle-revealed");
  } catch (err) {
    output.textContent = "⚠️ The Oracle was disturbed..."; // In case of errors, show a warning
    console.error(err); // Log the disturbance for mortal inspection
  }
}