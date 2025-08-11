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

  // Empty input handling
  if (!inputValue) {
    emptySummonCount++;

    oracleSection.classList.remove("hidden");

    // In boring mode: plain, no easter egg, no shake, no animations
    if (isBoring) {
      output.textContent = "Please enter an error message.";
      return;
    }

    // Mystical mode: keep wrath + shake + reveal
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

  // Reset wrath counter on proper offering
  emptySummonCount = 0;

  // Reveal the Oracle's chamber
  oracleSection.classList.remove("hidden");

  // Start loading state
  if (isBoring) {
    output.textContent = "Please wait...";
  } else {
    output.classList.remove("oracle-revealed");
    const randomWhisper =
      oracleWhispers[Math.floor(Math.random() * oracleWhispers.length)];
    output.textContent = randomWhisper;

    // Spinner only in mystical mode
    const spinner = document.createElement("div");
    spinner.classList.add("spinner");
    output.appendChild(spinner);

    // Retrigger reveal animation
    void output.offsetWidth;
    output.classList.add("oracle-revealed");
  }

  // Disable the button while fetching
  summonButton.disabled = true;
  summonButton.textContent = isBoring ? "Please Wait..." : "Summoning...";

  // Cancel any ongoing summon
  if (currentOracleAbort) currentOracleAbort.abort();
  currentOracleAbort = new AbortController();

  try {
    const response = await window.oracle.ask(
      inputValue,
      currentOracleAbort.signal
    );

    if (currentOracleAbort.signal.aborted) return;

    // Clear spinner if present (mystical only)
    const existingSpinner = output.querySelector(".spinner");
    if (existingSpinner) existingSpinner.remove();

    // Restore button
    summonButton.disabled = false;
    summonButton.textContent = isBoring ? "Submit" : "Summon Oracle";

    // Separate poetic verse from plain truths
    const [poetic, ...rest] = response.trim().split(/\n\s*\n/);
    const plain = rest.join("\n\n");

    if (isBoring) {
      // Boring mode: plain text only, no animations
      output.textContent = plain || response.trim();
    } else {
      // Mystical mode: styled spans + reveal
      output.classList.remove("oracle-revealed");
      void output.offsetWidth;
      output.innerHTML = `
        <span class="oracle-poetic">${poetic}</span>
        <span class="oracle-plain">${plain}</span>
      `;
      output.classList.add("oracle-revealed");
    }
  } catch (err) {
    if (err.name === "AbortError") return;

    const existingSpinner = output.querySelector(".spinner");
    if (existingSpinner) existingSpinner.remove();

    summonButton.disabled = false;
    summonButton.textContent = isBoring ? "Submit" : "Summon Oracle";

    output.textContent = isBoring
      ? "An error occurred."
      : "⚠️ The Oracle was disturbed...";
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
  summonButton.textContent = isBoring ? "Submit" : "Summon Oracle";

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

// Boring Mode
const boringButton = document.getElementById("boringModeButton");
let isBoring = false;

boringButton.addEventListener("click", () => {
  isBoring = !isBoring;

  document.body.classList.toggle("theme-boring", isBoring);
  document.body.classList.toggle("theme-twilight", !isBoring);

  boringButton.textContent = isBoring ? "Mystical Mode" : "Boring Mode";

  document.getElementById("summonButton").textContent = isBoring
    ? "Submit"
    : "Summon Oracle";
  document.getElementById("clearButton").textContent = isBoring
    ? "Clear"
    : "Cleanse";

  const subtitleEl = document.querySelector(".subtitle");
  if (subtitleEl) {
    subtitleEl.textContent = isBoring
      ? "Wow. Fun."
      : "Speak your error, mortal...";
  }

  // Hide theme swtich in boring mode
  const themeSwitchContainer = document.getElementById("themeSwitch").parentElement;
  if (themeSwitchContainer) {
    themeSwitchContainer.style.display = isBoring ? "none" : "block";
  }
});