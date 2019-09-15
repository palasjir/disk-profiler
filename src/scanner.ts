import {EVENT_MSG_TO_APP, EVENT_MSG_TO_SCANNER} from './commons/constants';
import {
    DirectoryNode,
    FsNode,
    NodeType,
    ScanStartEventData, SecondaryStats,
    ToAppMessage,
    ToAppMessageType,
    ToScannerMessage, ToScannerMessageType
} from './commons/types';

import {ipcRenderer} from 'electron';
import * as FS from 'fs';
import * as PATH from 'path';

/**
 * Normalizes windows style paths by replacing double backslahes with single forward slahes (unix style).
 */
function normalizePath(path: string): string {
    return path.replace(/\\/g, '/');
}

function getStats(path: string): FS.Stats | null {
    let stats = null;
    try {
        stats = FS.statSync(path);
    } catch (e) {
        console.error(`Can't read stats for ${path}.`);
    }
    return stats;
}

function addToTop10(current: FsNode[], candidate: FsNode) {
    if(current.length < 1) {
        current.push(candidate);
    }
    const index = current.findIndex(node => candidate.size >= node.size);
    if(index === -1 && current.length < 10) {
        current.push(candidate);
    } else {
        current.splice(index, 0, candidate);
    }
    if(current.length > 10) {
        current.pop();
    }
}

function scanDirectoryTree(dirPath: string, secondaryStats: SecondaryStats): FsNode | null {
    const name = PATH.basename(dirPath);
    const path = normalizePath(dirPath);
    const stats = getStats(path);
    if(!stats) {
        return null;
    }

    const node: FsNode = {
        name,
        path,
        size: 0,
        type: NodeType.UNKNOWN,
        lastModified: stats.mtimeMs
    };

    if(stats.isFile()) {
        node.size = stats.size;
        secondaryStats.numberOfFiles += 1;
        addToTop10(secondaryStats.topFiles, node);
    } else if (stats.isDirectory()) {
        const dirData = FS.readdirSync(dirPath);
        if (!dirData) return null;
        node.type = NodeType.FOLDER;
        const dirNode = node as DirectoryNode;
        dirNode.children = dirData
            .map(child => scanDirectoryTree(PATH.join(path, child), secondaryStats))
            .filter(e => !!e);
        dirNode.size = dirNode.children.reduce((prev, cur) => prev + cur.size, 0);
        secondaryStats.numberOfFolders += 1;
    } else {
        return null;
    }

    return node;
}

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

function sendScanFinishedMsg(tree: FsNode, stats: SecondaryStats) {
    const msg: ToAppMessage = {
        type: ToAppMessageType.FINISHED,
        data: {
            tree: {
                numberOfFiles: stats.numberOfFiles,
                numberOfFolders: stats.numberOfFolders,
                size: tree.size,
                topFiles: stats.topFiles,
                topFolders: stats.topFolders
            }
        }
    };
    ipcRenderer.send(EVENT_MSG_TO_APP, msg);
}

function sensScanError(e: Error) {
    const toAppMessage = {
        type: ToAppMessageType.ERROR,
        data: e
    };
    ipcRenderer.send(EVENT_MSG_TO_APP, toAppMessage)
}

function startScan(msg: ToScannerMessage) {
    sendScanInProgressMsg();
    const data = msg.data as ScanStartEventData;
    const stats: SecondaryStats = {
        numberOfFiles: 0,
        numberOfFolders: 0,
        topFiles: [],
        topFolders: []
    };
    try {
        const result = scanDirectoryTree(data.path, stats);
        sendScanFinishedMsg(result, stats);
    } catch (e) {
        sensScanError(e);
    }
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