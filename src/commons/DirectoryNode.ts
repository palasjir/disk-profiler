import {FileData} from './types';
import FileNode from './FileNode';


interface IDirectoryTreeNode {
    readonly name: string;
    readonly directories: Map<string, DirectoryNode>;
    readonly files: Map<string, FileNode>;

    getDirectory(name: string): DirectoryNode;
    addEmptyDirectory(name: string, isCompleteWord: boolean, data: FileData): DirectoryNode;
    removeDirectory(name: string): DirectoryNode;
    hasChild(name: string): boolean;
    hasChildren(): boolean;
    suggestDirectories(): string[];
}

export default class DirectoryNode implements IDirectoryTreeNode {

    readonly name: string;
    readonly directories: Map<string, DirectoryNode> = new Map();
    readonly files: Map<string, FileNode> = new Map();
    private _sizeInBytes: number = 0;
    parent: DirectoryNode = null;

    private _totalNumberOfDirectories: number = 0;
    private _totalNumberOfFiles: number = 0;

    constructor(name: string, isComplete: boolean = false, parent?: DirectoryNode | null) {
        this.name = name;
        this.parent = parent || null;
    }

    getDirectory(name: string): DirectoryNode {
        return this.directories.get(name);
    }

    getFile(name: string): FileNode {
        return this.files.get(name);
    }

    addEmptyDirectory(name: string, isComplete: boolean = false): DirectoryNode {
        if (!this.directories.has(name)) {
            const newNode = new DirectoryNode(name, isComplete, this);
            const prev = this.totalNumberOfDirectories;
            this._totalNumberOfDirectories += 1;
            this.directories.set(name, newNode);
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

    public addFile(name: string, data: FileData): void {
        const newNode = new FileNode(name, data);
        let prevSize = this._sizeInBytes;
        let prevNumber = this.totalNumberOfFiles;
        this._sizeInBytes += data.size;
        this._totalNumberOfFiles += 1;

        this.files.set(name, newNode);

        this.updateParentSize(prevSize);
        this.updateParentFileNumber(prevNumber);
    }

    public removeFile(name: string): void {
        const toRemove = this.files.get(name);
        if(toRemove) {
            const prevSize = this.sizeInBytes;
            this._sizeInBytes -= toRemove.data.size;
            this.files.delete(name);
            this.updateParentSize(prevSize);
        }
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
     * @return removed directory
     */
    removeDirectory(name: string): DirectoryNode {
        const childNode = this.getDirectory(name);
        if(!childNode){
            return null;
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

    hasChild(name: string): boolean {
        return this.directories.has(name);
    }

    hasChildren(): boolean {
        return this.directories.size !== 0;
    }

    suggestDirectories(): string[] {
        return [...this.directories.keys()];
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