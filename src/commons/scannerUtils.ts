/**
 * Normalizes windows style paths by replacing double backslashes with single forward slashes (unix style).
 */
import * as FS from 'fs';
import DirectoryTree from './DirectoryTree';
import * as PATH from "path";
import {FileData, NodeType} from './types';
import {stringify} from 'querystring';

export function normalizePath(path: string): string {
    return path.replace(/\\/g, '/');
}

export function getStats(path: string): FS.Stats | null {
    let stats = null;
    try {
        stats = FS.statSync(path);
    } catch (e) {
        console.error(`Can't read stats for ${path}.`);
    }
    return stats;
}

export function scanDirectoryTree(dirPath: string, tree: DirectoryTree): DirectoryTree {
    const path = normalizePath(dirPath);
    const stats = getStats(path);

    if(!stats) {
        return null;
    }

    const node: FileData = {
        size: 0,
        lastModified: stats.mtimeMs
    };

    if(stats.isFile()) {
        node.size = stats.size;
        tree.addFile(path, node);
    } else if (stats.isDirectory()) {
        tree.addEmptyDirectory(path);
        const dirData = FS.readdirSync(dirPath);
        if (dirData){
            dirData.forEach(child => {
                const childPath = PATH.join(path, child);
                scanDirectoryTree(childPath, tree);
            });
        }

    }

    return tree;
}