import DirectoryTree from "../models/DirectoryTree"
import DirectoryNode from "../models/DirectoryNode"
import {concatPath} from "./path"
import {FileInfo} from "../commons/types"
import * as util from "lodash"

export function extractFileListFromTree(tree: DirectoryTree): FileInfo[] {
    return extractFileListFromNode(tree.head, tree.rootPath)
}

export function extractFileListFromNode(
    head: DirectoryNode,
    rootPath: string
): FileInfo[] {
    let list: FileInfo[] = []

    const dirs = head.directories.values()
    for (const dir of dirs) {
        const found = extractFileListFromNode(
            dir,
            concatPath(rootPath, dir.name)
        )
        list = list.concat(found)
    }

    const files = head.files.values()
    for (const file of files) {
        list.push(file.info)
    }

    return list
}

export function getTopFiles(list: FileInfo[], limit: number): FileInfo[] {
    return util.take(util.sortBy(list, item => -item.size), limit)
}
