import { ipcMain, app, BrowserWindow, IpcMainEvent } from 'electron';
import {EVENT_MSG_SCAN, EVENT_START_SCAN} from './commons/constants';

function createAppWindow(): void {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadFile('app.html');
    mainWindow.on('closed', () => {
        // call quit to exit, otherwise the background windows will keep the app running
        app.quit()
    });

    async function startScan(event: IpcMainEvent, arg: string): Promise<void> {
        console.log('ipcMain start:scan received');
        const scannerWindow = await createScannerWindow();
        scannerWindow.once('ready-to-show', () => {
            scannerWindow.webContents.send(EVENT_START_SCAN, arg);
        });
    }

    function forwardMsg(event: IpcMainEvent, msg: string): void {
        mainWindow.webContents.send(EVENT_MSG_SCAN, msg);
    }

    ipcMain.on(EVENT_START_SCAN, startScan);
    ipcMain.on(EVENT_MSG_SCAN, forwardMsg);

}

async function createScannerWindow(): Promise<BrowserWindow> {
    const result = await new BrowserWindow({
        width: 50,
        height: 50,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    await result.loadFile('scanner.html');

    result.on('closed', () => {
        console.log('background window closed')
    });
    return result

}

app.on('ready', createAppWindow);