const path = require("path");
const { app, BrowserWindow, TouchBar } = require("electron");
const shell = require("shelljs");

const { EventEmitter } = require("events");

const event = new EventEmitter();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require('electron-squirrel-startup')) {
//     app.quit();
// }

const isDev = process.env.IS_DEV === "true";
let mainWindow = null;
// const cmd = "node app.js -p 8081";
// const shellObj = null; // 网易云执行对象

const runShell = () => {
  shell.exec("networksetup -setwebproxy Wi-Fi 127.0.0.1 8082", { async: true });
  shell.exec("networksetup -setsecurewebproxy Wi-Fi 127.0.0.1 8082", {
    async: true,
  });
  const cmdPath = path.join(
    app.getAppPath(),
    "/app/UnblockNeteaseMusic-mobile/"
  );
  console.log(app.getAppPath());
  console.log(cmdPath);
  event.on("outputLog", function (data) {
    console.log("some_event 事件触发", data);
    mainWindow.webContents.send("msg", { status: "success", data });
  });
  // eslint-disable-next-line global-require
  const { start } = require("./UnblockNeteaseMusic-mobile/app");
  start("8082");
  // setInterval(() => {
  //     console.log('data', netease);
  // }, 1000)
  // const child = shell.exec('node app.js -p 8081', {cwd: cmdPath});
  // child.stdout.on('data', function(data) {
  //     console.log(data)
  // })
  // child.stderr.on('data', function (data) {
  //     console.log('stderr: ' + data);
  // });
  // shellObj = shell.exec('node app.js -p 8081', {cwd: cmdPath, silent: true, async: true});
  // shellObj.stdout.on('data', function(data) {
  //     console.log('hha', data)
  //     mainWindow.webContents.send('msg', {status: 'what the hell1', data});
  // })
  // shellObj.stderr.on('data', function(data) {
  //
  //     mainWindow.webContents.send('msg', {status: 'err', data});
  //     setTimeout(() => {
  //         mainWindow.webContents.send('msg', {status: 'err', data});
  //     }, 5000);
  // })
  // shellObj.on('close', function(data) {
  //     mainWindow.webContents.send('msg', {status: 'err', data});
  //     setTimeout(() => {
  //         mainWindow.webContents.send('msg', {status: 'code', data});
  //     }, 10000);
  // })
  console.log("before set proxy");
};

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  // Open the DevTools.
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    // mainWindow.removeMenu();
    mainWindow.loadFile(path.join(__dirname, "build", "index.html"));
  }
  const devButton = new TouchBar.TouchBarButton({
    label: "打开控制台",
    click: () => {
      mainWindow.webContents.openDevTools();
    },
  });
  const touchBar = new TouchBar({ items: [devButton] });
  mainWindow.setTouchBar(touchBar);
  runShell();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  let flag = false;
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    // if (BrowserWindow.getAllWindows().length === 0) mainWindow.show();
    mainWindow.show();
  });
  mainWindow.on("close", function (e) {
    console.log("close");
    if (!flag) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
  app.on("before-quit", function () {
    console.log("before-quit");
    flag = true;
  });
  app.on("will-quit", function () {
    console.log("will-quit");
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  // shellObj.kill('SIGKILL')
  shell.exec("networksetup -setwebproxystate Wi-Fi off", { async: true });
  shell.exec("networksetup -setsecurewebproxystate Wi-Fi off", { async: true });
});

module.exports = event;
