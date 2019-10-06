import {
    DirectoryExplorerData,
    FileInfo,
    ToAppMessage,
    ToAppMessageType,
    ToScannerMessage,
    ToScannerMessageType,
} from "../commons/types"
import {ipcRenderer} from "electron"
import {EVENT_MSG_TO_APP, EVENT_MSG_TO_SCANNER} from "../commons/constants"
import DirectoryTree from "../models/DirectoryTree"
import * as util from "lodash"

export default class ScannerMessenger {
    public constructor(onMessage: (msg: ToScannerMessage) => void) {
        ipcRenderer.on(
            EVENT_MSG_TO_SCANNER,
            (event: any, msg: ToScannerMessage) => onMessage(msg)
        )
    }

    public readonly sendError = async (e: any): Promise<void> => {
        const toAppMessage = {
            type: ToAppMessageType.ERROR,
            data: e,
        }
        ipcRenderer.send(EVENT_MSG_TO_APP, toAppMessage)
    }

    public readonly sendScannerReadyMsg = async (): Promise<void> => {
        const msg: ToAppMessage = {
            type: ToAppMessageType.READY,
        }
        ipcRenderer.send(EVENT_MSG_TO_APP, msg)
    }

    public readonly sendScanInProgressMsg = (): void => {
        const msg: ToAppMessage = {
            type: ToAppMessageType.STARTED,
        }
        ipcRenderer.send(EVENT_MSG_TO_APP, msg)
    }

    public readonly sendScanFinishedMsg = async (
        tree: DirectoryTree
    ): Promise<void> => {
        const msg: ToAppMessage = {
            type: ToAppMessageType.FINISHED,
            data: {
                tree: {
                    numberOfFiles: tree.head.totalNumberOfFiles,
                    numberOfFolders: tree.head.totalNumberOfDirectories,
                    size: tree.head.sizeInBytes,
                },
            },
        }
        ipcRenderer.send(EVENT_MSG_TO_APP, msg)
    }

    public readonly sendScanUpdatedMsg = util.debounce(
        (
            tree: DirectoryTree,
            topFiles?: FileInfo[],
            requestType?: ToScannerMessageType
        ): void => {
            const msg: ToAppMessage = {
                type: ToAppMessageType.UPDATED,
                data: {
                    tree: {
                        numberOfFiles: tree.head.totalNumberOfFiles,
                        numberOfFolders: tree.head.totalNumberOfDirectories,
                        size: tree.head.sizeInBytes,
                        topFiles: topFiles,
                    },
                },
                requestType,
            }
            ipcRenderer.send(EVENT_MSG_TO_APP, msg)
        },
        1000
    )

    public readonly sendDirectoryExplorerData = (
        data: DirectoryExplorerData
    ): void => {
        const msg: ToAppMessage = {
            type: ToAppMessageType.DIR_EXPLORER_DATA,
            data: data,
        }
        ipcRenderer.send(EVENT_MSG_TO_APP, msg)
    }
}
