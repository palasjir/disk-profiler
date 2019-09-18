import {FileData} from './types';
import FileNode from './FileNode';
import {
    DirectoryNodeMeta,
    DirectoryNodeMetaUpdater,
    emptyMeta,
    updateMetaData
} from './metaDataUpdater';

interface IDirectoryTreeNode {
    readonly name: string;
    readonly directories: Map<string, DirectoryNode>;
    readonly files: Map<string, FileNode>;

    getDirectory(name: string): DirectoryNode;
    addEmptyDirectory(name: string, isCompleteWord: boolean, data: FileData): DirectoryNode;
    removeDirectory(name: string): DirectoryNode;
    hasDirectory(name: string): boolean;
    hasDirectories(): boolean;
}

function createSetDirectoryUpdater(newDir: DirectoryNode, oldDir?: DirectoryNode): DirectoryNodeMetaUpdater {

    const oldMeta: DirectoryNodeMeta = oldDir ? oldDir.meta : emptyMeta();

    const plusOne = oldDir ? 0 : 1;
    const sizeDiff = oldMeta.sizeInBytes - newDir.sizeInBytes;
    const filesDiff = oldMeta.totalNumberOfFiles - newDir.totalNumberOfFiles;
    const dirsDiff = oldMeta.totalNumberOfDirectories - newDir.totalNumberOfDirectories - plusOne;

    return {
        sizeInBytes: current => current.sizeInBytes - sizeDiff,
        totalNumberOfFiles: current => current.totalNumberOfFiles - filesDiff,
        totalNumberOfDirectories: current => current.totalNumberOfDirectories - dirsDiff
    };
}

function createRemoveDirectoryUpdater(dirToRemove: DirectoryNode): DirectoryNodeMetaUpdater {
    return {
        sizeInBytes: current => current.sizeInBytes - dirToRemove.sizeInBytes,
        totalNumberOfFiles: current => current.totalNumberOfFiles - dirToRemove.totalNumberOfFiles,
        totalNumberOfDirectories: current => current.totalNumberOfDirectories - dirToRemove.totalNumberOfDirectories - 1
    }
}

function createRemoveFileUpdater(fileToRemove: FileNode): DirectoryNodeMetaUpdater {
    return {
        sizeInBytes: current => current.sizeInBytes - fileToRemove.data.size,
        totalNumberOfFiles: current => current.totalNumberOfFiles - 1
    }
}

function createAddFileUpdater(newFile: FileNode): DirectoryNodeMetaUpdater {
    return {
        sizeInBytes: current => current.sizeInBytes + newFile.data.size,
        totalNumberOfFiles: current => current.totalNumberOfFiles + 1
    }
}

function createAddEmptyDirectoryUpdater(): DirectoryNodeMetaUpdater {
    return {
        totalNumberOfDirectories: current => current.totalNumberOfDirectories + 1
    }
}

export default class DirectoryNode implements IDirectoryTreeNode {

    readonly name: string;
    readonly directories: Map<string, DirectoryNode> = new Map();
    readonly files: Map<string, FileNode> = new Map();

    parent: DirectoryNode = null;
    meta: DirectoryNodeMeta = emptyMeta();

    constructor(name: string, parent?: DirectoryNode | null) {
        this.name = name;
        this.parent = parent || null;
    }

    public getDirectory(name: string): DirectoryNode | undefined {
        return this.directories.get(name);
    }

    public getFile(name: string): FileNode | undefined {
        return this.files.get(name);
    }

    public addEmptyDirectory(name: string): DirectoryNode {
        if (this.directories.has(name)) {
            return this.directories.get(name);
        }

        const newDir = new DirectoryNode(name, this);
        this.directories.set(name, newDir);

        this.updateMeta(createAddEmptyDirectoryUpdater());

        return newDir;
    }

    public setDirectory(name: string, newDir: DirectoryNode): DirectoryNode | null {
        if(name !== newDir.name) {
            // consistency check
            return null;
        }

        const oldDir = this.getDirectory(name);

        this.directories.set(name, newDir);
        newDir.parent = this;

        this.updateMeta(createSetDirectoryUpdater(newDir, oldDir));

        return newDir;
    }

    public addFile(name: string, data: FileData): FileNode | undefined {
        if(this.files.has(name)) {
            return this.getFile(name);
        }
        const newFile = new FileNode(name, data);
        this.files.set(name, newFile);
        this.updateMeta(createAddFileUpdater(newFile));

        return this.getFile(name);
    }

    public removeFile(name: string): FileNode | undefined {
        const fileToRemove = this.getFile(name);
        if(!fileToRemove) return undefined;

        this.updateMeta(createRemoveFileUpdater(fileToRemove));

        this.files.delete(name);

        return fileToRemove;
    }

    /**
     * Removes directory from structure.
     *
     * @param name - directory name
     * @return removed directory or undefined when there is nothing to remove
     */
    public removeDirectory(name: string): DirectoryNode | undefined {
        const dirToRemove = this.getDirectory(name);
        if(!dirToRemove){
            return undefined;
        }

        this.directories.delete(name);
        this.updateMeta(createRemoveDirectoryUpdater(dirToRemove));
        return dirToRemove;
    }

    public hasDirectory(name: string): boolean {
        return this.directories.has(name);
    }

    public hasDirectories(): boolean {
        return this.directories.size !== 0;
    }

    public getNumberOfFiles() {
        return this.files.size;
    }

    public getNumberOfDirectories() {
        return this.directories.size;
    }

    public get sizeInBytes(): number {
        return this.meta.sizeInBytes;
    }

    public get totalNumberOfFiles(): number {
        return this.meta.totalNumberOfFiles;
    }

    public get totalNumberOfDirectories(): number {
        return this.meta.totalNumberOfDirectories;
    }

    private updateMeta(updater: DirectoryNodeMetaUpdater): void {
        let currentNode: DirectoryNode = this;
        while(currentNode != null) {
            currentNode.meta = updateMetaData(currentNode.meta, updater);
            currentNode = currentNode.parent;
        }
    }
}