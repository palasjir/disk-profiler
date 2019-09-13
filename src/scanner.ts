import {EVENT_MSG_SCAN, EVENT_START_SCAN} from './commons/constants';
import {IDirectoryTree, ScanMessage, ScannedObject, ScannedObjectType, ScanState} from './commons/types';

const {ipcRenderer} = require('electron');
const fs = require('fs');
const path = require('path');

class ScannedDirectoryTree {

    tree: ScannedObject[] = [];

    public add(path: string, stats: ScannedObject) {
        this.tree.push(stats);
    }

    public update(path: string, stats: ScannedObject) {

    }

    public sortBy() {

    }

    public getTotal(): number {
        return this.tree.reduce(((total, current) => total + current.size), 0);
    }
}

function walkDir(dir: string, tree: ScannedDirectoryTree) {
    fs.readdirSync(dir).forEach((f: any) => {
        let dirPath = path.join(dir, f);
        let stats = undefined;
        try {
            stats = fs.statSync(dirPath);
        } catch (e) {
            console.error("Can't read stats");
        }
        if(!stats) {
            return;
        }
        const isDirectory = stats.isDirectory();
        const isFile = stats.isFile();
        if(isFile || isDirectory) {
            const type = isDirectory ? ScannedObjectType.directory : ScannedObjectType.file;
            tree.add(dir, {type, size: stats.size, path: dirPath});
        }

        if(isDirectory) {
            walkDir(dirPath, tree);
        }
    });
}

async function scanDirectory(dir: string): Promise<ScannedDirectoryTree> {
    const tree = new ScannedDirectoryTree();
    walkDir(dir, tree);
    return tree;
}

function sendStartMsg() {
    const msg: ScanMessage = {state: ScanState.IN_PROGRESS};
    ipcRenderer.send(EVENT_MSG_SCAN, msg);
}

function sendFinishedMsg(tree: ScannedDirectoryTree) {
    const data: IDirectoryTree = {
        totalSize: tree.getTotal()
    };

    const msg: ScanMessage = {
        state: ScanState.FINISHED,
        payload: data
    };
    ipcRenderer.send(EVENT_MSG_SCAN, msg);
}

ipcRenderer.on(EVENT_START_SCAN, async (event: any, pathName: string) => {
    console.log('starting scan', pathName);
    sendStartMsg();
    const result = await scanDirectory(pathName);
    sendFinishedMsg(result);
});