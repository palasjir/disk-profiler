import DirectoryWatcher from "./DirectoryWatcher"
import {
    DirectoryExplorerData,
    GetDirectoryExplorerData,
    ScanStartEventData,
    ToScannerMessage,
    ToScannerMessageType,
} from "../commons/types"
import DirectoryTree from "../models/DirectoryTree"
import ScannerMessenger from "./ScannerMessenger"
import {extractDirectoryListItemsFromTree} from "../utils/tree"
import {NormalizedPath} from "../models/NormalizedPath"

export default class ScannerProcess {
    private watcher?: DirectoryWatcher
    private messenger: ScannerMessenger

    public constructor() {
        this.messenger = new ScannerMessenger(this.handleMessage)
    }

    public init(): void {
        this.messenger.sendScannerReadyMsg()
    }

    private handleMessage = (msg: ToScannerMessage): void => {
        console.log(`Received event ${msg.type}.`)
        switch (msg.type) {
            case ToScannerMessageType.START:
                this.startScan(msg)
                break
            case ToScannerMessageType.SHOW_MORE:
                this.handleShowMoreFiles()
                break
            case ToScannerMessageType.GET_DIRECTORY_EXPLORER_DATA:
                this.handleGetDirectoryExplorerData(msg)
                break
            case ToScannerMessageType.CANCEL:
                // main process is taking care of this
                break
        }
    }

    private getAndSendTopFiles = (tree: DirectoryTree): void => {
        if (!this.watcher) return

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

        const handleUpdate = (): void => {
            if (!this.watcher) return

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

        const scannedPath = new NormalizedPath(data.rawNormalizedRootPath)
        this.watcher = new DirectoryWatcher(scannedPath, options)

        try {
            if (this.watcher) {
                await this.watcher.start()
                const tree = this.watcher.tree
                this.messenger.sendScanFinishedMsg(tree)
                canSendUpdates = true
                this.getAndSendTopFiles(tree)
            }
        } catch (e) {
            this.messenger.sendError(e)
        }
    }

    private readonly handleShowMoreFiles = async (): Promise<void> => {
        if (!this.watcher) return

        this.watcher.moreFiles()
        this.messenger.sendScanUpdatedMsg(
            this.watcher.tree,
            this.watcher.topFiles,
            ToScannerMessageType.SHOW_MORE
        )
    }

    private readonly handleGetDirectoryExplorerData = async (
        msg: ToScannerMessage
    ): Promise<void> => {
        const data = msg.data as GetDirectoryExplorerData
        const {rawNormalizedAbsolutePath} = data
        const normalizedAbsolutePath = new NormalizedPath(
            rawNormalizedAbsolutePath
        )
        try {
            if (!this.watcher) return
            const items = extractDirectoryListItemsFromTree(
                this.watcher.tree,
                normalizedAbsolutePath
            )
            const data: DirectoryExplorerData = {
                rawNormalizedAbsolutePath: normalizedAbsolutePath.value,
                items,
            }
            this.messenger.sendDirectoryExplorerData(data)
        } catch (e) {
            this.messenger.sendError(e)
        }
    }
}
