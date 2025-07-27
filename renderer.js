// Bind the toggle switch to the mortal body
const themeSwitch = document.getElementById("themeSwitch");
const body = document.body;
let emptySummonCount = 0;

// Default to Twilight (dark mode)
body.classList.add("theme-twilight");

themeSwitch.addEventListener("change", () => {
  if (themeSwitch.checked) {
    // Invoke the dawn
    body.classList.remove("theme-twilight");
    body.classList.add("theme-dawnlight");
  } else {
    // Summon the twilight
    body.classList.remove("theme-dawnlight");
    body.classList.add("theme-twilight");
  }
});

const errorInput = document.getElementById("errorInput");

errorInput.addEventListener("input", () => {
  errorInput.style.height = "auto";
  errorInput.style.height = errorInput.scrollHeight + "px";
});

// Output section (initially hidden)
const oracleSection = document.getElementById("oracleSection");

// Listen for clicks on the "Summon Oracle" button
document.getElementById("summonButton").addEventListener("click", invokeOracle);

// Invoke the Oracle to interpret the user's error
async function invokeOracle() {
  const inputValue = errorInput.value.trim();
  const output = document.getElementById("oracleOutput");

  // Guard clause for empty input
  if (!inputValue) {
    emptySummonCount++;

    const output = document.getElementById("oracleOutput");
    document.getElementById("oracleSection").classList.remove("hidden");

    output.classList.remove("oracle-revealed");
    void output.offsetWidth;

    if (emptySummonCount >= 5) {
      output.textContent = "DO NOT TEMPT ME, MORTAL";
      emptySummonCount = 0;
    } else {
      output.textContent = "You must offer an error message to the Oracle.";
    }

    output.classList.add("oracle-revealed");

    errorInput.classList.add("shake");
    setTimeout(() => errorInput.classList.remove("shake"), 500);
    return;
  }

  // Show output section (if hidden)
  oracleSection.classList.remove("hidden");

  // Clear and animate "Consulting the stars..."
  output.classList.remove("oracle-revealed");
  output.textContent = "Consulting the stars...";
  void output.offsetWidth;
  output.classList.add("oracle-revealed");

  try {
    const response = await window.oracle.ask(inputValue);

    // Split poetic + plain
    const [poetic, ...rest] = response.trim().split(/\n\s*\n/);
    const plain = rest.join("\n\n");

    // Reset and re-trigger animation cleanly for final message
    output.classList.remove("oracle-revealed");
    void output.offsetWidth;

    // Injected styled spans
    output.innerHTML = `
    <span class="oracle-poetic">${poetic}</span>
    <span class="oracle-plain">${plain}</span>
    `;
    output.classList.add("oracle-revealed");
  } catch (err) {
    output.textContent = "⚠️ The Oracle was disturbed...";
    console.error(err);
  }
}

// The cleansing
document.getElementById("clearButton").addEventListener("click", () => {
  errorInput.value = "";
  errorInput.style.height = "auto";
  oracleSection.classList.add("hidden");
  emptySummonCount = 0;
});