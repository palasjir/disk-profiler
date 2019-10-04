import {
    FileInfo,
    ToAppMessage,
    ToAppMessageType,
    ToScannerMessage,
    ToScannerMessageType,
} from "../commons/types"
import {ipcRenderer} from "electron"
import {EVENT_MSG_TO_APP} from "../commons/constants"
import DirectoryTree from "../models/DirectoryTree"
import * as util from "lodash"

export default class ScannerMessenger {
    public sendScannerReadyMsg = () => {
        const msg: ToAppMessage = {
            type: ToAppMessageType.READY,
        }
        ipcRenderer.send(EVENT_MSG_TO_APP, msg)
    }

    public sendScanInProgressMsg = () => {
        const msg: ToAppMessage = {
            type: ToAppMessageType.STARTED,
        }
        ipcRenderer.send(EVENT_MSG_TO_APP, msg)
    }

    public sendScanFinishedMsg = (tree: DirectoryTree) => {
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

    public sendScanUpdatedMsg = util.debounce(
        (
            tree: DirectoryTree,
            topFiles?: FileInfo[],
            requestType?: ToScannerMessageType
        ) => {
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
}
