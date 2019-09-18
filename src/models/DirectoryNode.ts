import {DirInfo, FileInfo} from '../commons/types';
import FileNode from './FileNode';
import {
    createAddEmptyDirectoryUpdater,
    createAddFileUpdater,
    createRemoveDirectoryUpdater,
    createRemoveFileUpdater,
    createSetDirectoryUpdater, DirInfoUpdater,
    emptyMeta, updateDirInfo,
} from './DirInfoUpdater';

export default class DirectoryNode {

    readonly name: string;
    readonly directories: Map<string, DirectoryNode> = new Map();
    readonly files: Map<string, FileNode> = new Map();

    parent: DirectoryNode = null;
    dirInfo: DirInfo = emptyMeta();

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

        this.updateDirInfoUp(createAddEmptyDirectoryUpdater());

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

        this.updateDirInfoUp(createSetDirectoryUpdater(newDir, oldDir));

        return newDir;
    }

    public addFile(name: string, data: FileInfo): FileNode | undefined {
        if(this.files.has(name)) {
            return this.getFile(name);
        }
        const newFile = new FileNode(name, data);
        this.files.set(name, newFile);
        this.updateDirInfoUp(createAddFileUpdater(newFile));

        return this.getFile(name);
    }

    public removeFile(name: string): FileNode | undefined {
        const fileToRemove = this.getFile(name);
        if(!fileToRemove) return undefined;

        this.updateDirInfoUp(createRemoveFileUpdater(fileToRemove));

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
        this.updateDirInfoUp(createRemoveDirectoryUpdater(dirToRemove));
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
        return this.dirInfo.sizeInBytes;
    }

    public get totalNumberOfFiles(): number {
        return this.dirInfo.totalNumberOfFiles;
    }

    public get totalNumberOfDirectories(): number {
        return this.dirInfo.totalNumberOfDirectories;
    }

    private updateDirInfoUp(updater: DirInfoUpdater): void {
        let currentNode: DirectoryNode = this;
        while(currentNode != null) {
            currentNode.dirInfo = updateDirInfo(currentNode.dirInfo, updater);
            currentNode = currentNode.parent;
        }
    }
}