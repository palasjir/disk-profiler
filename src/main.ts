import {app, BrowserWindow, ipcMain, IpcMainEvent} from "electron"
import {EVENT_MSG_TO_APP, EVENT_MSG_TO_SCANNER} from "./commons/constants"
import {
    ToAppMessage,
    ToAppMessageType,
    ToScannerMessage,
    ToScannerMessageType,
} from "./commons/types"

async function createMainWindow(
    scannerWindow: BrowserWindow
): Promise<BrowserWindow> {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    })

    mainWindow.on("closed", () => {
        // call quit to exit, otherwise the background windows will keep the app running
        app.quit()
    })

    async function cancelScanner() {
        const msg: ToAppMessage = {
            type: ToAppMessageType.CANCEL_IN_PROGRESS,
        }
        mainWindow.webContents.send(EVENT_MSG_TO_APP, msg)
        scannerWindow.close()
        scannerWindow = await createScannerWindow()
    }

    /**
     * Forwards messages to scanner process.
     */
    function toScanner(event: IpcMainEvent, msg: ToScannerMessage): void {
        if (msg.type === ToScannerMessageType.CANCEL) {
            cancelScanner()
            return
        }
        console.log(`Forwarding message to scanner: ${msg.type}.`)
        scannerWindow.webContents.send(EVENT_MSG_TO_SCANNER, msg)
    }

    /**
     * Forwards messages to app process.
     */
    function toApp(event: IpcMainEvent, msg: ToAppMessage): void {
        console.log(`Forwarding message to app: ${msg.type}.`)
        console.dir(msg)
        mainWindow.webContents.send(EVENT_MSG_TO_APP, msg)
    }

    await mainWindow.loadFile("app.html")

    // register IPC events
    ipcMain.on(EVENT_MSG_TO_SCANNER, toScanner)
    ipcMain.on(EVENT_MSG_TO_APP, toApp)

    return mainWindow
}

/**
 * Creates hidden window to run second process within one process.
 */
function createScannerWindow(): Promise<BrowserWindow> {
    return new Promise<BrowserWindow>(resolve => {
        const scannerWindow = new BrowserWindow({
            width: 50,
            height: 50,
            show: false,
            webPreferences: {
                nodeIntegration: true,
            },
        })
        scannerWindow.on("closed", () => {
            console.log("Scanner closed.")
        })
        scannerWindow.loadFile("scanner.html")
        scannerWindow.once("ready-to-show", () => {
            console.log("scanner is ready to show")
            resolve(scannerWindow)
        })
    })
}

async function initialise(): Promise<void> {
    const scannerWindow = await createScannerWindow()
    await createMainWindow(scannerWindow)
}

// start application
app.on("ready", initialise)
