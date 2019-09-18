import DirectoryTree from '../models/DirectoryTree';
import DirectoryNode from '../models/DirectoryNode';
import {concatPath} from './path';

export function extractFileListFromTree(tree: DirectoryTree): string[] {
    return extractFileListFromNode(tree.head, tree.rootPath);
}

export function extractFileListFromNode(head: DirectoryNode, rootPath: string): string[] {
    let list: string[] = [];

    const dirs = head.directories.values();
    for (const dir of dirs) {
        const found = extractFileListFromNode(dir, concatPath(rootPath, dir.name));
        list = list.concat(found);
    }

    const files = head.files.values();
    for (const file of files){
        const fileName = concatPath(rootPath, file.name);
        list.push(fileName);
    }

    return list;
}