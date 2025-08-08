// Bind the toggle switch to the mortal body
const themeSwitch = document.getElementById("themeSwitch");
const body = document.body;
let emptySummonCount = 0; // Track how many times the Oracle is summoned without an offering
let currentOracleAbort = null; // Track the current summoning process for cancellation

const oracleWhispers = [
  "Consulting the stars...",
  "Peering beyond the veil...",
  "Seeking truth in shadows...",
  "Summoning ancient wisdom...",
  "Channeling ethereal energy...",
  "Divining cosmic patterns...",
];

// Default to Twilight (dark mode)
body.classList.add("theme-twilight");

// Toggle between Dawnlight and Twilight themes
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

// Allow the input field to grow with the mortal's thoughts
const errorInput = document.getElementById("errorInput");

errorInput.addEventListener("input", () => {
  errorInput.style.height = "auto";
  errorInput.style.height = errorInput.scrollHeight + "px";
});

// Keep Oracle's response chamber hidden until summoned
const oracleSection = document.getElementById("oracleSection");

// Listen for clicks on the "Summon Oracle" button
document.getElementById("summonButton").addEventListener("click", invokeOracle);

// Ritual to invoke the Oracle to interpret the user's offering
async function invokeOracle() {
  const inputValue = errorInput.value.trim();
  const output = document.getElementById("oracleOutput");
  const summonButton = document.getElementById("summonButton");

  // If the offering is empty, warn the summoner - or unleash the hidden wrath
  if (!inputValue) {
    emptySummonCount++;

    oracleSection.classList.remove("hidden");
    output.classList.remove("oracle-revealed");
    void output.offsetWidth;

    if (emptySummonCount >= 5) {
      output.textContent = "DO NOT TEMPT ME, MORTAL";
      emptySummonCount = 0;
    } else {
      output.textContent = "You must offer an error message to the Oracle.";
    }

    output.classList.add("oracle-revealed");

    // Shake the input box for dramatic flair
    errorInput.classList.add("shake");
    setTimeout(() => errorInput.classList.remove("shake"), 500);
    return;
  }

  // Reset the wrath counter for a prpoer offering
  emptySummonCount = 0;

  // Reveal the Oracle's chamber
  oracleSection.classList.remove("hidden");

  // Begin the consultation ritual
  output.classList.remove("oracle-revealed");
  const randomWhisper =
    oracleWhispers[Math.floor(Math.random() * oracleWhispers.length)];
  output.textContent = randomWhisper;

  // Conjure the spinnining
  const spinner = document.createElement("div");
  spinner.classList.add("spinner");
  output.appendChild(spinner);

  // Disable the summoning button 
  summonButton.disabled = true;
  summonButton.textContent = "Summoning...";

  // Retrigger reveal animation
  void output.offsetWidth;
  output.classList.add("oracle-revealed");

  // Cancel any ongoing summon
  if (currentOracleAbort) currentOracleAbort.abort();
  currentOracleAbort = new AbortController();

  try {
    const response = await window.oracle.ask(inputValue, currentOracleAbort.signal);

    if (currentOracleAbort.signal.aborted) return;

    // Clear the cosmic spinner
    const existingSpinner = output.querySelector(".spinner");
    if (existingSpinner) existingSpinner.remove();

    // Restore invocation state
    summonButton.disabled = false;
    summonButton.textContent = "Summon Oracle";

    // Seperate poetic verse from plain truths
    const [poetic, ...rest] = response.trim().split(/\n\s*\n/);
    const plain = rest.join("\n\n");

    // Animante the revelation
    output.classList.remove("oracle-revealed");
    void output.offsetWidth;

    // Inject styled spans
    output.innerHTML = `
      <span class="oracle-poetic">${poetic}</span>
      <span class="oracle-plain">${plain}</span>
    `;
    output.classList.add("oracle-revealed");
  } catch (err) {
    if (err.name === "AbortError") return;

    // If the Oracle is unreachable
    const existingSpinner = output.querySelector(".spinner");
    if (existingSpinner) existingSpinner.remove();

    summonButton.disabled = false;
    summonButton.textContent = "Summon Oracle";

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

  const summonButton = document.getElementById("summonButton");
  summonButton.disabled = false;
  summonButton.textContent = "Summon Oracle";

  if (currentOracleAbort) {
    currentOracleAbort.abort();
  }
});

// Modal logic
const aboutButton = document.getElementById("aboutButton");
const aboutModal = document.getElementById("aboutModal");
const closeModal = document.getElementById("closeModal");

aboutButton.addEventListener("click", () => {
  aboutModal.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
  aboutModal.classList.add("hidden");
});

window.addEventListener("click", (event) => {
  if (event.target === aboutModal) {
    aboutModal.classList.add("hidden");
  }
});
