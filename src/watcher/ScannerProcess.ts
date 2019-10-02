import DirectoryWatcher from "./DirectoryWatcher"
import {
    ScanStartEventData,
    ToAppMessageType,
    ToScannerMessage,
    ToScannerMessageType,
} from "../commons/types"
import {ipcRenderer} from "electron"
import {EVENT_MSG_TO_APP, EVENT_MSG_TO_SCANNER} from "../commons/constants"
import DirectoryTree from "../models/DirectoryTree"
import ScannerMessenger from "./ScannerMessenger"

export default class ScannerProcess {
    private watcher?: DirectoryWatcher
    private messenger = new ScannerMessenger()

    public init(): void {
        ipcRenderer.on(EVENT_MSG_TO_SCANNER, this.handleMessage)
        this.messenger.sendScannerReadyMsg()
    }

    private handleMessage = (event: any, msg: ToScannerMessage) => {
        console.log(`Received event ${msg.type}.`)
        switch (msg.type) {
            case ToScannerMessageType.START:
                this.startScan(msg)
                break
            case ToScannerMessageType.SHOW_MORE:
                this.handleShowMoreFiles()
            case ToScannerMessageType.CANCEL:
                // main process is taking care of this
                break
        }
    }

    private getAndSendTopFiles = (tree: DirectoryTree) => {
        this.watcher.initTopFiles()
        this.messenger.sendScanUpdatedMsg(tree, this.watcher.topFiles)
    }

    private startScan = async (msg: ToScannerMessage): Promise<void> => {
        let canSendUpdates = false

        if (this.watcher) {
            this.watcher.stop()
            this.watcher = undefined
        }

        this.messenger.sendScanInProgressMsg()
        const data = msg.data as ScanStartEventData

        const handleUpdate = () => {
            if (canSendUpdates) {
                this.messenger.sendScanUpdatedMsg(
                    this.watcher.tree,
                    this.watcher.topFiles
                )
            }
        }

        const options = {
            onFileAdded: handleUpdate,
            onFileRemoved: handleUpdate,
            onFileChanged: handleUpdate,
            onDirAdded: handleUpdate,
            onDirRemoved: handleUpdate,
        }

        const scannedPath = data.path
        this.watcher = new DirectoryWatcher(scannedPath, options)

        try {
            await this.watcher.start()
            const tree = this.watcher.tree
            this.messenger.sendScanFinishedMsg(tree)
            canSendUpdates = true
            this.getAndSendTopFiles(tree)
        } catch (e) {
            this.sendScanError(e)
        }
    }

    private sendScanError = (e: any) => {
        const toAppMessage = {
            type: ToAppMessageType.ERROR,
            data: e,
        }
        ipcRenderer.send(EVENT_MSG_TO_APP, toAppMessage)
    }

    private handleShowMoreFiles = () => {
        this.watcher.moreFiles()
        this.messenger.sendScanUpdatedMsg(
            this.watcher.tree,
            this.watcher.topFiles
        )
    }
}
