import DirectoryTree from "../models/DirectoryTree"
import DirectoryNode from "../models/DirectoryNode"
import {DirListItemModel, DirListItemType, FileInfo} from "../commons/types"
import * as util from "lodash"
import {NormalizedPath} from "./NormalizedPath"
import {normalizePath} from "./path"

export function extractFileListFromNode(
    head: DirectoryNode,
    rootPath: NormalizedPath
): FileInfo[] {
    let list: FileInfo[] = []

    const dirs = head.directories.values()
    for (const dir of dirs) {
        const normPath = normalizePath(dir.name)
        const absolutePath = rootPath.join(normPath)
        const found = extractFileListFromNode(dir, absolutePath)
        list = list.concat(found)
    }

    const files = head.files.values()
    for (const file of files) {
        list.push(file.info)
    }

    return list
}

export function extractFileListFromTree(tree: DirectoryTree): FileInfo[] {
    return extractFileListFromNode(tree.head, tree.rootPath)
}

export function getTopFiles(list: FileInfo[], limit: number): FileInfo[] {
    return util.take(util.sortBy(list, item => -item.size), limit)
}

export function extractDirectoryListItemsFromNode(
    node: DirectoryNode
): DirListItemModel[] {
    const items: DirListItemModel[] = []

    for (const file of node.files.values()) {
        items.push({
            type: DirListItemType.FILE,
            itemCount: undefined,
            name: file.name,
            size: file.info.size,
        })
    }

    for (const dir of node.directories.values()) {
        items.push({
            type: DirListItemType.FOLDER,
            itemCount: dir.files.size + dir.directories.size,
            name: dir.name,
            size: dir.sizeInBytes,
        })
    }

    return util.sortBy(items, it => -it.size) // desc
}

export function extractDirectoryListItemsFromTree(
    tree: DirectoryTree,
    normalizedAbsolutePath: NormalizedPath
): DirListItemModel[] {
    const dir = tree.findDirectory(normalizedAbsolutePath)
    return !dir ? [] : extractDirectoryListItemsFromNode(dir)
}
