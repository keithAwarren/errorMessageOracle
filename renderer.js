// Bind the toggle switch to the mortal body
const themeSwitch = document.getElementById("themeSwitch");
const body = document.body;

// The mortal ledger of state
let isBoring = false; // Whether the veil is shut (boring mode)
let lastTheme = "twilight"; // Remember dawn vs twilight when we go boring
let emptySummonCount = 0; // Track how many times the Oracle is summoned without an offering
let currentOracleAbort = null; // Track the current summoning process for cancellation
let lastOracle = { poetic: "", plain: "", hasContent: false }; // Cache the latest prophecy

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

// Theme rites 
function applyTheme(theme) {
  body.classList.remove("theme-twilight", "theme-dawnlight");
  if (theme === "dawn") {
    body.classList.add("theme-dawnlight");
    if (themeSwitch) themeSwitch.checked = true;
  } else {
    body.classList.add("theme-twilight");
    if (themeSwitch) themeSwitch.checked = false;
  }
}

// Toggle between Dawnlight and Twilight themes (ignored while boring)
if (themeSwitch) {
  themeSwitch.addEventListener("change", () => {
    if (isBoring) return; // the sun and moon heed not while boring
    lastTheme = themeSwitch.checked ? "dawn" : "twilight";
    applyTheme(lastTheme);
  });
}

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

// Render the cached prophecy to match the current mood of the cosmos
function renderOutputFromState() {
  const output = document.getElementById("oracleOutput");
  const header = document.querySelector(".output-section h2");
  if (!lastOracle.hasContent) return;

  // Toggle the output header by mode
  if (header) header.style.display = isBoring ? "none" : "block";

  if (isBoring) {
    // Plain only—no frills, no fate
    output.textContent = lastOracle.plain || lastOracle.poetic || "";
  } else {
    // Poetic + plain, with reveal—render safely
    output.textContent = "";
    const poeticEl = document.createElement("span");
    poeticEl.className = "oracle-poetic";
    poeticEl.textContent = lastOracle.poetic || "";
    const plainEl = document.createElement("span");
    plainEl.className = "oracle-plain";
    plainEl.textContent = lastOracle.plain || "";
    output.appendChild(poeticEl);
    output.appendChild(plainEl);

    output.classList.remove("oracle-revealed");
    void output.offsetWidth;
    output.classList.add("oracle-revealed");
  }
}

// Ritual to invoke the Oracle to interpret the mortal's offering
async function invokeOracle() {
  const inputValue = errorInput.value.trim();
  const output = document.getElementById("oracleOutput");
  const summonButton = document.getElementById("summonButton");
  const header = document.querySelector(".output-section h2");

  // Empty offering: mild admonishment—or wrath, if they persist
  if (!inputValue) {
    emptySummonCount++;
    oracleSection.classList.remove("hidden");
    if (header) header.style.display = isBoring ? "none" : "block";

    if (isBoring) {
      output.textContent = "Please enter an error message.";
      return;
    }

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

  // A worthy sacrifice resets the counter
  emptySummonCount = 0;

  // Reveal the Oracle's chamber
  oracleSection.classList.remove("hidden");
  if (header) header.style.display = isBoring ? "none" : "block";

  // Begin the consultation ritual
  if (isBoring) {
    output.textContent = "Please wait...";
  } else {
    output.classList.remove("oracle-revealed");
    const randomWhisper =
      oracleWhispers[Math.floor(Math.random() * oracleWhispers.length)];
    output.textContent = randomWhisper;

    // Spinner only for those who enjoy spectacle
    const spinner = document.createElement("div");
    spinner.classList.add("spinner");
    output.appendChild(spinner);

    void output.offsetWidth;
    output.classList.add("oracle-revealed");
  }

  // Disable the summoning button while the veil parts
  summonButton.disabled = true;
  summonButton.textContent = isBoring ? "Please Wait..." : "Summoning...";

  // Cancel any ongoing summon and begin anew (true cancel all the way down)
  if (currentOracleAbort) currentOracleAbort.abort();
  currentOracleAbort = new AbortController();

  try {
    const response = await window.oracle.ask(
      inputValue,
      currentOracleAbort.signal
    );

    // If the rite was interrupted, drift away silently
    if (currentOracleAbort.signal.aborted) return;

    // Separate poetic verse from plain truths
    const [poetic, ...rest] = response.trim().split(/\n\s*\n/);
    const plain = rest.join("\n\n");

    // Record the prophecy and render it to match the current mood
    lastOracle = { poetic, plain, hasContent: true };
    renderOutputFromState();
  } catch (err) {
    // A canceled rite is not an omen
    if (err && err.name === "AbortError") return;

    // If the Oracle is disturbed, say so—plainly or with flair
    const existingSpinner = output.querySelector(".spinner");
    if (existingSpinner) existingSpinner.remove();

    output.textContent = isBoring
      ? "An error occurred."
      : "⚠️ The Oracle was disturbed...";
    console.error(err);
  } finally {
    // Always lift the finger from the scale
    const existingSpinner = document
      .getElementById("oracleOutput")
      .querySelector(".spinner");
    if (existingSpinner) existingSpinner.remove();

    summonButton.disabled = false;
    summonButton.textContent = isBoring ? "Submit" : "Summon Oracle";
  }
}

// The cleansing
document.getElementById("clearButton").addEventListener("click", () => {
  errorInput.value = "";
  errorInput.style.height = "auto";
  oracleSection.classList.add("hidden");
  emptySummonCount = 0;
  lastOracle = { poetic: "", plain: "", hasContent: false }; // reset the scroll

  if (currentOracleAbort) {
    currentOracleAbort.abort();
    currentOracleAbort = null;
  }

  const summonButton = document.getElementById("summonButton");
  summonButton.disabled = false;
  summonButton.textContent = isBoring ? "Submit" : "Summon Oracle";
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

// Boring Mode — seal the veil; restore the sky upon return
const boringButton = document.getElementById("boringModeButton");
boringButton.addEventListener("click", () => {
  isBoring = !isBoring;

  // Remember the mortal's preferred sky before we shut the blinds
  if (isBoring) {
    lastTheme = themeSwitch && themeSwitch.checked ? "dawn" : "twilight";
    body.classList.remove("theme-dawnlight", "theme-twilight");
    body.classList.add("theme-boring");
  } else {
    body.classList.remove("theme-boring");
    applyTheme(lastTheme);
  }

  boringButton.textContent = isBoring ? "Mystical Mode" : "Boring Mode";

  document.getElementById("summonButton").textContent = isBoring
    ? "Submit"
    : "Summon Oracle";
  document.getElementById("clearButton").textContent = isBoring
    ? "Clear"
    : "Cleanse";

  const subtitleEl = document.querySelector(".subtitle");
  if (subtitleEl) {
    // Keep your current quip; swap to "Wow. Fun" if you prefer silence
    subtitleEl.textContent = isBoring
      ? "Wow. Fun."
      : "Speak your error, mortal...";
  }

  // Hide the whole theme toggle cluster in boring mode
  const themeToggleWrap = document.querySelector(".theme-toggle");
  if (themeToggleWrap) {
    themeToggleWrap.style.display = isBoring ? "none" : "flex";
  }

  // Ensure the output header matches the mood immediately
  const header = document.querySelector(".output-section h2");
  if (header) header.style.display = isBoring ? "none" : "block";

  // Repaint any existing prophecy to match the mode
  renderOutputFromState();
});

// --- Easter Egg: Konami Pulse (non-boring only) ---
(() => {
  const seq = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let buffer = [];
  const titleEl = document.querySelector("header h1");
  if (!titleEl) return;

  window.addEventListener("keydown", (e) => {
    buffer.push(e.key);
    if (buffer.length > seq.length) buffer.shift();
    if (seq.every((k, i) => buffer[i]?.toLowerCase() === k.toLowerCase())) {
      if (!isBoring) {
        titleEl.classList.add("konami-glow");
        setTimeout(() => titleEl.classList.remove("konami-glow"), 6000);
      }
      buffer = [];
    }
  });
})();