const { app, BrowserWindow } = require('electron')

const path = require('path')
const url = require('url')

let mainWindow
let loadingScreen

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        webPreferences: {
            nodeIntegration: true
        },
        show: false
    })
    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadURL(
        process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.join(__dirname, '/../public/index.html'),
            protocol: 'file:',
            slashes: true
        })
    )

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    mainWindow.webContents.on('did-finish-load', () => {
        if (loadingScreen)
            loadingScreen.close();
        mainWindow.show();
    })
}

const createLoadingScreen = () => {
    loadingScreen = new BrowserWindow(
            Object.assign({
                width: 400,
                height: 200,
                frame: false,
                transparent: true
            })
        );
        loadingScreen.setResizable(false);
        loadingScreen.loadURL(
            path.join(__dirname, '/../public/loading.html'),
        );
        loadingScreen.on('closed', () => (loadingScreen = null));
        loadingScreen.webContents.on('did-finish-load', () => {
        loadingScreen.show();
    });
}

app.on('ready', () => {
    createLoadingScreen();

    createWindow();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})
