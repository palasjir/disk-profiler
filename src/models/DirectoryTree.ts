// Character that we will use for trie tree root.
import DirectoryNode from "./DirectoryNode"
import FileNode from "./FileNode"
import {FileInfo} from "../commons/types"
import {isEqual} from "lodash"
import {NormalizedPath} from "./NormalizedPath"

const HEAD_CHARACTER = "."

export default class DirectoryTree {
    readonly rootPath: NormalizedPath
    readonly head: DirectoryNode

    public constructor(rootPath: NormalizedPath) {
        this.head = new DirectoryNode(HEAD_CHARACTER)
        this.rootPath = rootPath
    }

    public hasSameRoot(path: NormalizedPath): boolean {
        return path.startsWith(this.rootPath)
    }

    public getPathRelativeToRoot(absolutePath: NormalizedPath): NormalizedPath {
        if (!this.hasSameRoot(absolutePath)) {
            throw new Error("Not same root!")
        }
        return absolutePath.removeRoot(this.rootPath)
    }

    public addEmptyDirectory(
        absolutePath: NormalizedPath
    ): DirectoryNode | undefined {
        try {
            const pathFragments = this.getPathRelativeToRoot(absolutePath)
            return this.createDirectoryStructure(pathFragments)
        } catch (e) {
            return undefined
        }
    }

    /**
     *
     * @param absolutePath
     * @param data
     * @return added file or undefine if no file was added
     */
    public addFile(
        absolutePath: NormalizedPath,
        data: FileInfo
    ): FileNode | undefined {
        if (!this.hasSameRoot(absolutePath)) {
            return undefined
        }
        const pathRelativeToRoot = this.getPathRelativeToRoot(absolutePath)
        const lastIndex = pathRelativeToRoot.length - 1
        const directories = pathRelativeToRoot.slice(0, lastIndex)

        const currentNode = this.createDirectoryStructure(directories)
        return currentNode.addFile(pathRelativeToRoot.value[lastIndex], data)
    }

    /**
     *
     * @param absoulutePath
     * @param newFileInfo
     * @return null if file is not updated
     */
    public updateFile(
        absoulutePath: NormalizedPath,
        newFileInfo: FileInfo
    ): FileNode | null {
        if (!this.hasSameRoot(absoulutePath)) {
            return null
        }
        const file = this.findFile(absoulutePath)
        if (!file) {
            return null
        }
        if (isEqual(file.info, newFileInfo)) {
            return null
        }
        file.info = newFileInfo
        return file
    }

    public removeDirectory(
        absoultePath: NormalizedPath
    ): DirectoryNode | undefined {
        const directoryParent = this.findDirectory(absoultePath, true)
        if (!directoryParent) {
            return undefined
        }

        const pathRelativeToRoot = this.getPathRelativeToRoot(absoultePath)
        const lastIndex = pathRelativeToRoot.length - 1
        const toRemove = pathRelativeToRoot.value[lastIndex]
        return directoryParent.removeDirectory(toRemove)
    }

    /**
     *
     * @param absolutePath - path to file
     * @return removed file
     */
    public removeFile(absolutePath: NormalizedPath): FileNode | undefined {
        const directoryParent = this.findDirectory(absolutePath, true)

        if (!directoryParent) {
            return undefined
        }

        const pathRelativeToRoot = this.getPathRelativeToRoot(absolutePath)
        const lastIndex = pathRelativeToRoot.length - 1
        const toRemove = pathRelativeToRoot.value[lastIndex]
        return directoryParent.removeFile(toRemove)
    }

    public findDirectory(
        absolutePath: NormalizedPath,
        returnParent?: boolean
    ): DirectoryNode | undefined {
        try {
            const pathRelativeToRoot = this.getPathRelativeToRoot(absolutePath)
            let currentNode: DirectoryNode | undefined = this.head

            const end = returnParent
                ? pathRelativeToRoot.length - 1
                : pathRelativeToRoot.length

            for (let charIndex = 0; charIndex < end; charIndex += 1) {
                if (
                    !currentNode ||
                    !currentNode.hasDirectory(
                        pathRelativeToRoot.value[charIndex]
                    )
                ) {
                    return undefined
                }
                currentNode = currentNode.getDirectory(
                    pathRelativeToRoot.value[charIndex]
                )
            }

            return currentNode
        } catch (e) {
            return undefined
        }
    }

    public findFile(absolutePath: NormalizedPath): FileNode | undefined {
        const containingDirectory = this.findDirectory(absolutePath, true)
        if (!containingDirectory) {
            return undefined
        }
        const pathRelativeToRoot = this.getPathRelativeToRoot(absolutePath)
        const lastIndex = pathRelativeToRoot.length - 1
        const fileName = pathRelativeToRoot.value[lastIndex]

        return containingDirectory.getFile(fileName)
    }

    private createDirectoryStructure(
        pathRelativeToRoot: NormalizedPath
    ): DirectoryNode {
        if (pathRelativeToRoot.length < 1) {
            return this.head
        }

        let currentNode = this.head

        for (
            let pathFragmentIndex = 0;
            pathFragmentIndex < pathRelativeToRoot.length;
            pathFragmentIndex += 1
        ) {
            const pathFragment = pathRelativeToRoot.value[pathFragmentIndex]
            currentNode = currentNode.addEmptyDirectory(pathFragment)
        }

        return currentNode
    }
}
