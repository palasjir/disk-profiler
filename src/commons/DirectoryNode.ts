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
            this.directories.set(name, newNode);
        }

        return  this.directories.get(name);
    }

    setDirectory(name: string, node: DirectoryNode): DirectoryNode | null {
        if(name !== node.name) {
            // consistency check
            return null;
        }
        const prevSize = this.sizeInBytes;
        if(this.directories.has(name)) {
            const childNode = this.getDirectory(name);
            this._sizeInBytes -= childNode.sizeInBytes;
        }
        this._sizeInBytes += node.sizeInBytes;
        this.directories.set(name, node);
        node.parent = this;

        this.updateParentSize(prevSize);

        return node;
    }

    public addFile(name: string, data: FileData): void {
        const newNode = new FileNode(name, data);
        let prevSize = this._sizeInBytes;
        this._sizeInBytes += data.size;

        this.files.set(name, newNode);

        this.updateParentSize(prevSize);
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

    removeDirectory(name: string): DirectoryNode {
        const childNode = this.getDirectory(name);
        this.directories.delete(name);
        this._sizeInBytes -= childNode._sizeInBytes;

        return this;
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
}