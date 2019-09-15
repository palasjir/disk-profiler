import { ipcMain, app, BrowserWindow, IpcMainEvent } from 'electron';
import {EVENT_MSG_SCAN, EVENT_START_SCAN} from './commons/constants';

async function createMainWindow(): Promise<BrowserWindow> {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.on('closed', () => {
        // call quit to exit, otherwise the background windows will keep the app running
        app.quit();
    });

    /**
     * Starts new scanner process.
     */
    async function startScanner(event: IpcMainEvent, arg: string): Promise<void> {
        console.log('ipcMain start:scan received');
        const scannerWindow = await createScannerWindow();

        scannerWindow.once('ready-to-show', () => {
            scannerWindow.webContents.send(EVENT_START_SCAN, arg);
        });
    }

    /**
     * Forwards messages to scanner process.
     */
    function toScanner(event: IpcMainEvent, msg: string): void {
        mainWindow.webContents.send(EVENT_MSG_SCAN, msg);
    }

    await mainWindow.loadFile('app.html');

    // register IPC events
    ipcMain.on(EVENT_START_SCAN, startScanner);
    ipcMain.on(EVENT_MSG_SCAN, toScanner);

    return mainWindow;
}

/**
 * Creates hidden window to run second process within one process.
 */
async function createScannerWindow(): Promise<BrowserWindow> {
    const result = new BrowserWindow({
        width: 50,
        height: 50,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    result.on('closed', () => {
        console.log('background window closed')
    });
    await result.loadFile('scanner.html');

    return result

}

// start application
app.on('ready', createMainWindow);