import {
    ipcRenderer,
    IpcRendererEvent,
    OpenDialogReturnValue,
    remote,
} from "electron"
import {
    FileInfo,
    ScanResultData,
    ScanState,
    ToAppMessage,
    ToAppMessageType,
    ToScannerMessage,
    ToScannerMessageType,
} from "../commons/types"
import {action, computed, observable} from "mobx"
import {EVENT_MSG_TO_APP, EVENT_MSG_TO_SCANNER} from "../commons/constants"
import {take} from "lodash"

async function openSelectDirectoryDialog(): Promise<OpenDialogReturnValue> {
    return remote.dialog.showOpenDialog({properties: ["openDirectory"]})
}

export enum ResultDisplay {
    DASHBOARD,
    FILES,
    DIRECTORIES,
}

export enum GetMoreState {
    READY,
    PENDING,
}

export class AppStore {
    @observable
    public scanState: ScanState = ScanState.NOT_STARTED

    @observable
    public showMoreState: GetMoreState = GetMoreState.READY

    @observable
    public resultDisplay: ResultDisplay = ResultDisplay.DASHBOARD

    @observable
    public selectedDirectory?: string

    @observable
    public totalSize?: number = 0

    @observable
    public numberOfFiles: number = 0

    @observable
    public numberOfFolders: number = 0

    @observable
    public topFiles: FileInfo[] = []

    public constructor() {
        ipcRenderer.on(EVENT_MSG_TO_APP, this.handleScanMsg)
    }

    @action
    private readonly handleScanMsg = (
        event: IpcRendererEvent,
        msg: ToAppMessage
    ): void => {
        switch (msg.type) {
            case ToAppMessageType.READY:
                this.handleScanReady(msg)
                break
            case ToAppMessageType.CANCEL_IN_PROGRESS:
                this.handleCancelInProgress(msg)
                break
            case ToAppMessageType.STARTED:
                this.handleScanStarted(msg)
                break
            case ToAppMessageType.FINISHED:
                this.handleScanFinished(msg)
                break
            case ToAppMessageType.ERROR:
                this.handleScanError(msg)
                break
            case ToAppMessageType.UPDATED:
                this.handleScanFinished(msg)
                break
        }
    }

    @action
    private readonly handleScanReady = (msg: ToAppMessage): void => {
        this.scanState = ScanState.NOT_STARTED
    }

    @action
    private readonly handleCancelInProgress = (msg: ToAppMessage): void => {
        this.scanState = ScanState.CANCEL_IN_PROGRESS
    }

    @action
    private readonly handleScanStarted = (msg: ToAppMessage): void => {
        this.scanState = ScanState.SCAN_IN_PROGRESS
    }

    @action
    private readonly handleScanFinished = (msg: ToAppMessage): void => {
        this.scanState = ScanState.FINISHED
        const data = msg.data as ScanResultData

        if (data && data.tree) {
            this.totalSize = data.tree.size
            this.numberOfFiles = data.tree.numberOfFiles
            this.numberOfFolders = data.tree.numberOfFolders
            this.topFiles = data.tree.topFiles
        }

        if (msg.requestType === ToScannerMessageType.SHOW_MORE) {
            this.showMoreState = GetMoreState.READY
        }
    }

    @action
    private readonly handleScanError = (msg: ToAppMessage): void => {
        this.scanState = ScanState.NOT_STARTED
    }

    @action
    public async startDirectoryScan(): Promise<void> {
        const selectedDirectoryList = await openSelectDirectoryDialog()
        if (selectedDirectoryList.filePaths.length <= 0) {
            return
        }
        this.selectedDirectory = selectedDirectoryList.filePaths[0]
        this.resultDisplay = ResultDisplay.DASHBOARD

        const msg: ToScannerMessage = {
            type: ToScannerMessageType.START,
            data: {
                path: this.selectedDirectory,
            },
        }
        ipcRenderer.send(EVENT_MSG_TO_SCANNER, msg)
    }

    public cancelDirectoryScan(): void {
        const msg: ToScannerMessage = {
            type: ToScannerMessageType.CANCEL,
        }
        ipcRenderer.send(EVENT_MSG_TO_SCANNER, msg)
    }

    @computed
    public get inProgressMsg(): string {
        switch (this.scanState) {
            case ScanState.CANCEL_IN_PROGRESS:
                return "Canceling ..."
            case ScanState.SCAN_IN_PROGRESS:
                return "Scan in progress ..."
            default:
                return ""
        }
    }

    public revealInFileExplorer(fullPath: string) {
        remote.shell.showItemInFolder(fullPath)
    }

    @action
    public showMoreFiles(): void {
        if (this.showMoreState === GetMoreState.PENDING) {
            return
        }
        const msg: ToScannerMessage = {
            type: ToScannerMessageType.SHOW_MORE,
        }
        this.showMoreState = GetMoreState.PENDING
        ipcRenderer.send(EVENT_MSG_TO_SCANNER, msg)
    }

    @action
    public setResultDisplay(display: ResultDisplay) {
        this.resultDisplay = display
    }

    @computed
    public get top10Files(): FileInfo[] {
        return take(this.topFiles, 10)
    }
}
