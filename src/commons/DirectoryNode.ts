import {FileData} from './types';
import FileNode from './FileNode';


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

export default class DirectoryNode implements IDirectoryTreeNode {

    readonly name: string;
    readonly directories: Map<string, DirectoryNode> = new Map();
    readonly files: Map<string, FileNode> = new Map();
    private _sizeInBytes: number = 0;
    parent: DirectoryNode = null;

    private _totalNumberOfDirectories: number = 0;
    private _totalNumberOfFiles: number = 0;

    constructor(name: string, parent?: DirectoryNode | null) {
        this.name = name;
        this.parent = parent || null;
    }

    getDirectory(name: string): DirectoryNode | undefined {
        return this.directories.get(name);
    }

    getFile(name: string): FileNode | undefined {
        return this.files.get(name);
    }

    addEmptyDirectory(name: string): DirectoryNode {
        if (!this.directories.has(name)) {
            const newNode = new DirectoryNode(name, this);
            const prev = this.totalNumberOfDirectories;
            this.directories.set(name, newNode);

            this._totalNumberOfDirectories += 1;
            this.updateParentDirectoryNumber(prev);
        }

        return this.directories.get(name);
    }

    setDirectory(name: string, node: DirectoryNode): DirectoryNode | null {
        if(name !== node.name) {
            // consistency check
            return null;
        }
        const prevSize = this.sizeInBytes;
        const prevFiles = this._totalNumberOfFiles;
        const prevDirs = this._totalNumberOfDirectories;
        if(this.directories.has(name)) {
            const childNode = this.getDirectory(name);
            this._sizeInBytes -= childNode.sizeInBytes;
        }
        this.directories.set(name, node);
        node.parent = this;

        this._sizeInBytes += node.sizeInBytes;
        this._totalNumberOfDirectories = this.directories.size + node.totalNumberOfDirectories;
        this._totalNumberOfFiles = this.files.size + node.totalNumberOfFiles;

        this.updateParentSize(prevSize);
        this.updateParentFileNumber(prevFiles);
        this.updateParentDirectoryNumber(prevDirs);

        return node;
    }

    public addFile(name: string, data: FileData): FileNode | null {
        if(this.files.has(name)) {
            return this.getFile(name);
        }
        const newNode = new FileNode(name, data);
        let prevSize = this._sizeInBytes;
        let prevNumber = this.totalNumberOfFiles;
        this._sizeInBytes += data.size;
        this._totalNumberOfFiles += 1;

        this.files.set(name, newNode);

        this.updateParentSize(prevSize);
        this.updateParentFileNumber(prevNumber);

        return this.getFile(name);
    }

    public removeFile(name: string): FileNode | undefined {
        const toRemove = this.getFile(name);
        if(!toRemove) {
            return undefined;
        }

        const prevSize = this.sizeInBytes;
        this._sizeInBytes -= toRemove.data.size;
        const prevFiles = this.totalNumberOfFiles;
        this._totalNumberOfFiles -= 1;
        this.files.delete(name);

        this.updateParentSize(prevSize);
        this.updateParentFileNumber(prevFiles);

        return toRemove;
    }

    private updateParentDirectoryNumber(prev: number) {
        if(prev === this.totalNumberOfDirectories){
            // no need to update parents
            return;
        }

        let currentNode: DirectoryNode = this;
        let currentParent: DirectoryNode = this.parent;

        while(currentParent != null) {
            let currentParentPrevSize = currentParent.totalNumberOfDirectories;
            currentParent._totalNumberOfDirectories -= prev;
            prev = currentParentPrevSize;
            currentParent._totalNumberOfDirectories += currentNode.totalNumberOfDirectories;

            currentNode = currentParent;
            currentParent = currentParent.parent;
        }
    }

    private updateParentFileNumber(prev: number) {
        if(prev === this.totalNumberOfFiles){
            // no need to update parents
            return;
        }

        let currentNode: DirectoryNode = this;
        let currentParent: DirectoryNode = this.parent;

        while(currentParent != null) {
            let currentParentPrevSize = currentParent.totalNumberOfFiles;
            currentParent._totalNumberOfFiles -= prev;
            prev = currentParentPrevSize;
            currentParent._totalNumberOfFiles += currentNode.totalNumberOfFiles;

            currentNode = currentParent;
            currentParent = currentParent.parent;
        }
    }

    private updateParentSize(prevSize: number) {
        if(prevSize === this.sizeInBytes){
            // no need to update parents
            return;
        }

        let currentNode: DirectoryNode = this;
        let currentParent: DirectoryNode = this.parent;

        while(currentParent != null) {
            let currentParentPrevSize = currentParent._sizeInBytes;
            currentParent._sizeInBytes -= prevSize;
            prevSize = currentParentPrevSize;
            currentParent._sizeInBytes += currentNode._sizeInBytes;

            currentNode = currentParent;
            currentParent = currentParent.parent;
        }
    }

    /**
     * Removes directory from structure.
     *
     * @param name - directory name
     * @return removed directory or undefined when there is nothing to remove
     */
    removeDirectory(name: string): DirectoryNode | undefined {
        const childNode = this.getDirectory(name);
        if(!childNode){
            return undefined;
        }

        this.directories.delete(name);
        const prevSize = this.sizeInBytes;
        this._sizeInBytes -= childNode._sizeInBytes;
        const prevNumOfDirs = this.totalNumberOfDirectories;
        this._totalNumberOfDirectories -= (childNode.totalNumberOfDirectories + 1);
        const prevNumOfFiles = this.totalNumberOfFiles;
        this._totalNumberOfFiles -= childNode.totalNumberOfFiles;

        this.updateParentDirectoryNumber(prevNumOfDirs);
        this.updateParentFileNumber(prevNumOfFiles);
        this.updateParentSize(prevSize);

        return childNode;
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
        return this._sizeInBytes;
    }

    public get totalNumberOfFiles(): number {
        return this._totalNumberOfFiles;
    }

    public get totalNumberOfDirectories(): number {
        return this._totalNumberOfDirectories;
    }
}