import DirectoryTree from '../models/DirectoryTree';
import DirectoryNode from '../models/DirectoryNode';
import {concatPath} from './path';
import {FileInfo} from '../commons/types';
import FileNode from '../models/FileNode';
import * as util from 'lodash';

export function createFileInfo(fileNode: FileNode, path: string): FileInfo {
    return {
        ...fileNode.info,
        path
    };
}

export function extractFileListFromTree(tree: DirectoryTree): FileInfo[] {
    return extractFileListFromNode(tree.head, tree.rootPath);
}

export function extractFileListFromNode(head: DirectoryNode, rootPath: string): FileInfo[] {
    let list: FileInfo[] = [];

    const dirs = head.directories.values();
    for (const dir of dirs) {
        const found = extractFileListFromNode(dir, concatPath(rootPath, dir.name));
        list = list.concat(found);
    }

    const files = head.files.values();
    for (const file of files){
        const filePath = concatPath(rootPath, file.name);
        const info = createFileInfo(file, filePath);
        list.push(info);
    }

    return list;
}

export function getTopFiles(list: FileInfo[], limit: number): FileInfo[] {
    return util.take(util.sortBy(list, item => -item.size), limit);
}