import {EVENT_MSG_TO_APP, EVENT_MSG_TO_SCANNER} from './commons/constants';
import {
    ScanStartEventData,
    ToAppMessage,
    ToAppMessageType,
    ToScannerMessage,
    ToScannerMessageType
} from './commons/types';

import {ipcRenderer} from 'electron';
import DirectoryTree from './commons/DirectoryTree';
import {createDirectoryTreeWatcher} from './commons/watcher';

let tree: DirectoryTree;
let watcher: any;
let canSendUpdates = false;

// function addToTop10(current: FileData[], candidate: FileData) {
//     if(current.length < 1) {
//         current.push(candidate);
//     }
//     const index = current.findIndex(node => candidate.size >= node.size);
//     if(index === -1 && current.length < 10) {
//         current.push(candidate);
//     } else {
//         current.splice(index, 0, candidate);
//     }
//     if(current.length > 10) {
//         current.pop();
//     }
// }

function sendScannerReadyMsg() {
    const msg: ToAppMessage = {
        type: ToAppMessageType.READY
    };
    ipcRenderer.send(EVENT_MSG_TO_APP, msg);
}

function sendScanInProgressMsg() {
    const msg: ToAppMessage = {
        type: ToAppMessageType.STARTED
    };
    ipcRenderer.send(EVENT_MSG_TO_APP, msg);
}

function sendScanFinishedMsg(tree: DirectoryTree) {
    const msg: ToAppMessage = {
        type: ToAppMessageType.FINISHED,
        data: {
            tree: {
                numberOfFiles: tree.head.totalNumberOfFiles,
                numberOfFolders: tree.head.totalNumberOfDirectories,
                size: tree.head.sizeInBytes
            }
        }
    };
    ipcRenderer.send(EVENT_MSG_TO_APP, msg);
}

function sendScanUpdatedMsg(tree: DirectoryTree) {
    const msg: ToAppMessage = {
        type: ToAppMessageType.UPDATED,
        data: {
            tree: {
                numberOfFiles: tree.head.totalNumberOfFiles,
                numberOfFolders: tree.head.totalNumberOfDirectories,
                size: tree.head.sizeInBytes
            }
        }
    };
    ipcRenderer.send(EVENT_MSG_TO_APP, msg);
}

function sendScanError(e: any) {
    const toAppMessage = {
        type: ToAppMessageType.ERROR,
        data: e
    };
    ipcRenderer.send(EVENT_MSG_TO_APP, toAppMessage)
}

function startScan(msg: ToScannerMessage) {
    canSendUpdates = false;
    if(watcher) {
        watcher.close();
        watcher = null;
    }
    sendScanInProgressMsg();
    const data = msg.data as ScanStartEventData;

    const onUpdate = () => {
        if(canSendUpdates) {
            sendScanUpdatedMsg(tree);
        }
    };

    [watcher, tree] = createDirectoryTreeWatcher(data.path, {
        onDirRemoved: onUpdate,
        onFileAdded: onUpdate,
        onFileRemoved: onUpdate,
        onFileChanged: onUpdate,
        onError(e: any) {
            sendScanError(e)
        },
        onReady(): void {
            sendScanFinishedMsg(tree);
            canSendUpdates = true
        }
    });
}

function handleMessage(event: any, msg: ToScannerMessage): void {
    console.log(`Received event ${msg.type}.`);
    switch (msg.type) {
        case ToScannerMessageType.START:
            startScan(msg);
            break;
        case ToScannerMessageType.CANCEL:
            // main process is taking care of this
            break;
    }
}

function init(): void {
    ipcRenderer.on(EVENT_MSG_TO_SCANNER, handleMessage);
    sendScannerReadyMsg();
}

init();