let filePath = "";

async function handleOnOpenFileButtonPress() {
  const { content, path } = await window.electronAPI.openCodeFile();

  filePath = path;

  const textArea = document.getElementById("code-input-textarea");
  textArea.value = content;
}

async function handleOnSaveFileButtonPress() {
  const textArea = document.getElementById("code-input-textarea");

  const { path } = await window.electronAPI.saveCodeFile(textArea.value);

  filePath = path;
}

async function handleOnRunCodeButtonPress() {
  const result = await window.electronAPI.runCodeFile(filePath);

  const table = document.getElementById("token-table-content");

  table.innerHTML = "";

  result.tokens.forEach((row) => {
    const tableRow = table.insertRow();

    const lineCell = tableRow.insertCell();
    lineCell.innerHTML = row.line;

    const columnCell = tableRow.insertCell();
    columnCell.innerHTML = row.column;

    const tokenCell = tableRow.insertCell();
    tokenCell.innerHTML = row.type;

    const textCell = tableRow.insertCell();
    textCell.classList.add("td-text-column");
    textCell.innerHTML = row.text;

    table.appendChild(tableRow);
  });

  const runStatusText = document.getElementById("run-status-text");

  runStatusText.classList.remove("body-text-success", "body-text-error");

  const errorsTabButtonLabel = document.getElementById(
    "errors-tab-button-label"
  );

  errorsTabButtonLabel.textContent = `Errors`;

  errorsTabButtonLabel.classList.remove("tab-button-error");

  const errorsList = document.getElementById("errors-list");

  errorsList.innerHTML = "";

  if (result?.errors?.length) {
    errorsTabButtonLabel.textContent = `Errors (${result.errors.length})`;

    errorsTabButtonLabel.classList.add("tab-button-error");

    runStatusText.textContent = `${result.errors.length} error(s) found`;

    runStatusText.classList.add("body-text-error");

    result.errors.forEach((error) => {
      const paragraph = document.createElement("p");

      paragraph.textContent = error;

      paragraph.classList.add("body-text-error");

      errorsList.appendChild(paragraph);
    });
  } else {
    runStatusText.textContent = `Successfully compiled`;

    runStatusText.classList.add("body-text-success");
  }
}

function hiddenTokensTab() {
  const tokensTableHead = document.getElementById("tokens-table-head");

  tokensTableHead.style.display = "none";

  const tokensTableBody = document.getElementById("tokens-table-body");

  tokensTableBody.style.display = "none";
}

function showTokensTab() {
  const tokensTableHead = document.getElementById("tokens-table-head");

  tokensTableHead.style.display = "flex";

  const tokensTableBody = document.getElementById("tokens-table-body");

  tokensTableBody.style.display = "flex";
}

function hiddenErrorsTab() {
  const errorsList = document.getElementById("errors-list");

  errorsList.style.display = "none";
}

function showErrorsTab() {
  const errorsList = document.getElementById("errors-list");

  errorsList.style.display = "flex";
}

async function handleOnTokensTabButtonPress(tokensTabButton) {
  showTokensTab();
  hiddenErrorsTab();

  const activedTabButtons =
    document.getElementsByClassName("tab-button-active");

  for (let i = 0; i < activedTabButtons.length; i++) {
    activedTabButtons[i].classList.remove("tab-button-active");
  }

  tokensTabButton.classList.add("tab-button-active");
}

async function handleOnErrorsTabButtonPress(errorsTabButton) {
  showErrorsTab();
  hiddenTokensTab();

  const activedTabButtons =
    document.getElementsByClassName("tab-button-active");

  for (let i = 0; i < activedTabButtons.length; i++) {
    activedTabButtons[i].classList.remove("tab-button-active");
  }

  errorsTabButton.classList.add("tab-button-active");
}

document.addEventListener("DOMContentLoaded", () => {
  const openFileButton = document.getElementById("open-file-button");

  openFileButton.addEventListener("click", handleOnOpenFileButtonPress);

  const saveFileButton = document.getElementById("save-file-button");

  saveFileButton.addEventListener("click", handleOnSaveFileButtonPress);

  const runButton = document.getElementById("run-code-button");

  runButton.addEventListener("click", handleOnRunCodeButtonPress);

  const tokensTabButton = document.getElementById("tokens-tab-button");

  tokensTabButton.addEventListener("click", () =>
    handleOnTokensTabButtonPress(tokensTabButton)
  );

  const errorsTabButton = document.getElementById("errors-tab-button");

  errorsTabButton.addEventListener("click", () =>
    handleOnErrorsTabButtonPress(errorsTabButton)
  );
});
