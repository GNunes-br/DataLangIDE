const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs");
const { spawn } = require("child_process");

const path = require("path");
// const sdkPath = "./sdk/DataLangSDK.jar";
const sdkPath = "./resources/app/sdk/DataLangSDK.jar";

async function handleCodeFileOpen() {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Arquivos de texto", extensions: ["txt"] }],
    });

    if (canceled) return;

    const path = filePaths[0];
    const content = await fs.promises.readFile(filePaths[0], "utf-8");

    return { path, content };
  } catch (error) {
    console.error(`Erro ao ler arquivo: ${error}`);
  }
}

async function handleCodeFileSave(event, content) {
  try {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: "Salvar arquivo",
      defaultPath: "~/arquivo.txt",
    });

    if (canceled) return;

    const path = filePath;

    await fs.promises.writeFile(path, content);

    return {
      path,
    };
  } catch (error) {
    console.error(`Erro ao salvar arquivo: ${error}`);
  }
}

async function handleCodeRun(event, path) {
  try {
    function run() {
      return new Promise((resolve, reject) => {
        let outData;

        const args = ["-lex", path];
        const java = spawn("java", ["-jar", sdkPath, ...args]);

        java.stdout.on("data", (data) => {
          outData = data;
        });

        java.on("exit", (code) => {
          if (code === 0) {
            resolve(outData);
          } else {
            reject(new Error(`Command failed with code ${code}`));
          }
        });
      });
    }

    return JSON.parse(await run());
  } catch (error) {
    console.error(`Erro ao executar arquivo: ${error}`);
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "src/preload.js"),
    },
  });
  mainWindow.loadFile("src/index.html");
}

app.whenReady().then(() => {
  ipcMain.handle("dialog:openCodeFile", handleCodeFileOpen);
  ipcMain.handle("dialog:saveCodeFile", handleCodeFileSave);
  ipcMain.handle("runCodeFile", handleCodeRun);
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
