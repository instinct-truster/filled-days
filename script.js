const themeSelector = document.querySelector("#theme-selector");

themeSelector.addEventListener("change", function (e) {
  document.documentElement.setAttribute("data-theme", e.target.value);
});

let isDarkMode = false;
setupInitialColorScheme();

const darkLightButton = document.querySelector("#dark-light-button");

darkLightButton.addEventListener("click", () => {
  toggleDarkOrLight();
});

function setupInitialColorScheme() {
  const isDarkModePreferred = isSystemDarkMode();
  const colorScheme = isDarkModePreferred ? "dark" : "light";
  setColorMode(colorScheme);
  isDarkMode = colorScheme === "dark";
}

function toggleDarkOrLight() {
  const nextMode = isDarkMode ? "light" : "dark";
  setColorMode(nextMode);
  isDarkMode = nextMode === "dark";
}

function setColorMode(nextMode) {
  document.documentElement.style = `color-scheme:${nextMode}`;
}

function isSystemDarkMode() {
  return matchMedia("(prefers-color-scheme: dark)").matches;
}
