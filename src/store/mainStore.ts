import {ipcRenderer, IpcRendererEvent, OpenDialogReturnValue, remote} from 'electron';
import {ScanMessage, ScanState} from '../commons/types';
import {action, observable} from 'mobx';
import {EVENT_MSG_SCAN, EVENT_START_SCAN} from '../commons/constants';

async function openSelectDirectoryDialog(): Promise<OpenDialogReturnValue> {
    return remote.dialog.showOpenDialog({ properties: ['openDirectory'] })
}

export class MainStore {

    @observable
    public scanState: ScanState = ScanState.NOT_STARTED;

    @observable
    public totalSize?: number;

    public constructor() {
        ipcRenderer.on(EVENT_MSG_SCAN, this.handleScanMsg);
    }

    @action
    private readonly handleScanMsg = (event: IpcRendererEvent, result: ScanMessage): void => {
        this.scanState = result.state;
        const payload = result.payload;
        if(payload) {
            this.totalSize = payload.totalSize;
        }
    };

    public async startDirectoryScan(): Promise<void> {
        const selectedDirectoryList = await openSelectDirectoryDialog();
        if(selectedDirectoryList.filePaths.length <= 0) {
            return;
        }
        const selectedDirectory = selectedDirectoryList.filePaths[0];
        console.log(`Selected directory: ${selectedDirectory}`);
        ipcRenderer.send(EVENT_START_SCAN, selectedDirectory);
    }

}