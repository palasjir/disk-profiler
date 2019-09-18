import {EVENT_MSG_TO_APP, EVENT_MSG_TO_SCANNER} from './commons/constants';
import {
    FileInfo,
    ScanStartEventData,
    ToAppMessage,
    ToAppMessageType,
    ToScannerMessage,
    ToScannerMessageType
} from './commons/types';

import {ipcRenderer} from 'electron';
import {createDirectoryTreeWatcher} from './watcher/watcher';
import DirectoryTree from './models/DirectoryTree';
import * as util from 'lodash';
import {extractFileListFromTree, getTopFiles} from './utils/tree';

let tree: DirectoryTree;
let watcher: any;
let canSendUpdates = false;
let topFiles: FileInfo[] | undefined;

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

const sendScanUpdatedMsg = util.debounce(function sendScanUpdatedMsg(tree: DirectoryTree, topFiles?: FileInfo[]) {
    const msg: ToAppMessage = {
        type: ToAppMessageType.UPDATED,
        data: {
            tree: {
                numberOfFiles: tree.head.totalNumberOfFiles,
                numberOfFolders: tree.head.totalNumberOfDirectories,
                size: tree.head.sizeInBytes,
                topFiles: topFiles
            }
        }
    };
    ipcRenderer.send(EVENT_MSG_TO_APP, msg);
}, 1000);

function sendScanError(e: any) {
    const toAppMessage = {
        type: ToAppMessageType.ERROR,
        data: e
    };
    ipcRenderer.send(EVENT_MSG_TO_APP, toAppMessage)
}

function getAndSendTopFiles(tree: DirectoryTree) {
    const files = extractFileListFromTree(tree);
    const topFiles = getTopFiles(files, 100);
    sendScanUpdatedMsg(tree, topFiles);
    return topFiles;
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
            canSendUpdates = true;
            topFiles = getAndSendTopFiles(tree);
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