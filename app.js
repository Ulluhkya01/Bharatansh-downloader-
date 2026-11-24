const form = document.querySelector("#download-form");
const input = document.querySelector("#video-url");
const button = document.querySelector("#download-btn");
const result = document.querySelector("#result");

function showResult(message, isError = false) {
  result.hidden = false;
  result.className = "result" + (isError ? " error" : "");
  result.textContent = message;
}

document.querySelector("#paste-btn").addEventListener("click", async () => {
  try {
    input.value = await navigator.clipboard.readText();
    input.focus();
  } catch {
    showResult("Clipboard access isn't available. Paste your link into the field manually.", true);
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  result.hidden = true;
  button.disabled = true;
  button.querySelector("span:first-child").textContent = "Checking link…";
  try {
    const response = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: input.value.trim() })
    });
    const data = await response.json();
    if (!response.ok) {
      showResult([data.error, data.detail].filter(Boolean).join(" "), true);
    } else {
      showResult("Your video is ready.");
    }
  } catch {
    showResult("Couldn't reach the server. Please try again.", true);
  } finally {
    button.disabled = false;
    button.querySelector("span:first-child").textContent = "Check video link";
  }
});
