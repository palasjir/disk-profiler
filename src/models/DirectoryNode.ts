import {DirInfo, FileInfo} from "../commons/types"
import FileNode from "./FileNode"
import {
    createAddEmptyDirectoryUpdater,
    createAddFileUpdater,
    createRemoveDirectoryUpdater,
    createRemoveFileUpdater,
    createSetDirectoryUpdater,
    emptyMeta,
    updateDirInfoUp,
} from "./DirInfoUpdater"

export default class DirectoryNode {
    readonly name: string
    readonly directories: Map<string, DirectoryNode> = new Map()
    readonly files: Map<string, FileNode> = new Map()

    parent: DirectoryNode | null = null
    dirInfo: DirInfo = emptyMeta()

    constructor(name: string, parent?: DirectoryNode | null) {
        this.name = name
        this.parent = parent || null
    }

    public getDirectory(name: string): DirectoryNode | undefined {
        return this.directories.get(name)
    }

    public getFile(name: string): FileNode | undefined {
        return this.files.get(name)
    }

    public addEmptyDirectory(name: string): DirectoryNode {
        if (this.directories.has(name)) {
            return this.directories.get(name) as DirectoryNode
        }

        const newDir = new DirectoryNode(name, this)
        this.directories.set(name, newDir)

        updateDirInfoUp(this, createAddEmptyDirectoryUpdater())

        return newDir
    }

    public setDirectory(
        name: string,
        newDir: DirectoryNode
    ): DirectoryNode | null {
        if (name !== newDir.name) {
            // consistency check
            return null
        }

        const oldDir = this.getDirectory(name)

        this.directories.set(name, newDir)
        newDir.parent = this

        updateDirInfoUp(this, createSetDirectoryUpdater(newDir, oldDir))

        return newDir
    }

    public addFile(name: string, data: FileInfo): FileNode | undefined {
        if (this.files.has(name)) {
            return this.getFile(name) as FileNode
        }
        const newFile = new FileNode(name, data, this)
        this.files.set(name, newFile)
        updateDirInfoUp(this, createAddFileUpdater(newFile))

        return this.getFile(name)
    }

    public removeFile(name: string): FileNode | undefined {
        const fileToRemove = this.getFile(name)
        if (!fileToRemove) return undefined

        updateDirInfoUp(this, createRemoveFileUpdater(fileToRemove))
        if (!this.files.delete(name)) {
            return undefined
        }

        return fileToRemove
    }

    /**
     * Removes directory from structure.
     *
     * @param name - directory name
     * @return removed directory or undefined when there is nothing to remove
     */
    public removeDirectory(name: string): DirectoryNode | undefined {
        const dirToRemove = this.getDirectory(name)
        if (!dirToRemove) {
            return undefined
        }

        this.directories.delete(name)
        updateDirInfoUp(this, createRemoveDirectoryUpdater(dirToRemove))
        return dirToRemove
    }

    public hasDirectory(name: string): boolean {
        return this.directories.has(name)
    }

    public hasDirectories(): boolean {
        return this.directories.size !== 0
    }

    public getNumberOfFiles(): number {
        return this.files.size
    }

    public getNumberOfDirectories(): number {
        return this.directories.size
    }

    public get sizeInBytes(): number {
        return this.dirInfo.sizeInBytes
    }

    public get totalNumberOfFiles(): number {
        return this.dirInfo.totalNumberOfFiles
    }

    public get totalNumberOfDirectories(): number {
        return this.dirInfo.totalNumberOfDirectories
    }
}
