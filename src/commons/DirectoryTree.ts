// Character that we will use for trie tree root.
import DirectoryNode from './DirectoryNode';
import {FileData} from './types';
import FileNode from './FileNode';

const HEAD_CHARACTER = '.';

export default class DirectoryTree {

    readonly rootPath: string;
    readonly head: DirectoryNode;

    public constructor(rootPath: string) {
        this.head = new DirectoryNode(HEAD_CHARACTER);
        this.rootPath = rootPath.endsWith('/') ? rootPath : `${rootPath}/`;
    }

    public hasSameRoot(path: string) {
        return path.startsWith(this.rootPath);
    }

    public removeRootPath(path: string) {
        return path.trim().slice(this.rootPath.length);
    }

    public getPathFragments(path: string): string[] {
        const pathWithoutRoot = this.removeRootPath(path);
        return pathWithoutRoot.split('/');
    }

    public addDirectory(path: string): DirectoryTree {
        if(!this.hasSameRoot(path)){
            return this;
        }
        const pathFragments = this.getPathFragments(path);
        this.createDirectoryStructure(pathFragments);
        return this;
    }

    public addFile(path: string, data: FileData): DirectoryTree {
        if(!this.hasSameRoot(path)){
            return this;
        }
        const pathFragments = this.getPathFragments(path);
        const directories = pathFragments.slice(0, pathFragments.length - 1);

        const currentNode = this.createDirectoryStructure(directories);
        currentNode.addFile(pathFragments[pathFragments.length - 1], data);

        return this;
    }

    public removeDirectory(path: string): DirectoryTree {
        const pathFragments = this.getPathFragments(path);
        const directoryParent = this.findDirectory(path, true);
        const toRemove = pathFragments[pathFragments.length - 1];
        directoryParent.removeDirectory(toRemove);
        return this;
    }

    public removeFile(path: string): DirectoryTree {
        const pathFragments = this.getPathFragments(path);
        const directoryParent = this.findDirectory(path, true);
        const toRemove = pathFragments[pathFragments.length - 1];
        directoryParent.removeFile(toRemove);
        return this;
    }

    suggestNextPath(path: string): string[] {
        const lastCharacter = this.findDirectory(path);

        if (!lastCharacter) {
            return null;
        }

        return lastCharacter.suggestDirectories();
    }

    public doesDirectoryExist(path: string): boolean {
        const lastNode = this.findDirectory(path);

        return !!lastNode;
    }

    public findDirectory(path: string, returnParent?: boolean): DirectoryNode | null {
        const pathFragments = this.getPathFragments(path);
        let currentNode = this.head;

        const end = returnParent ? pathFragments.length - 1 : pathFragments.length;

        for (let charIndex = 0; charIndex < end; charIndex += 1) {
            if (!currentNode.hasChild(pathFragments[charIndex])) {
                return null;
            }

            currentNode = currentNode.getDirectory(pathFragments[charIndex]);
        }

        return currentNode;
    }

    public findFile(path: string): FileNode | null {
        const containingDirectory = this.findDirectory(path);
        if(!containingDirectory) {
            return null;
        }
        const pathFragments = this.getPathFragments(path);
        const fileName = pathFragments[pathFragments.length - 1];

        return containingDirectory.getFile(fileName);
    }

    private createDirectoryStructure(pathFragments: string[]) {
        if(pathFragments.length < 1) {
            return this.head;
        }

        let currentNode = this.head;

        for (let pathFragmentIndex = 0; pathFragmentIndex < pathFragments.length; pathFragmentIndex += 1) {
            const isComplete = pathFragmentIndex === pathFragments.length - 1;
            const pathFragment = pathFragments[pathFragmentIndex];
            currentNode = currentNode.addEmptyDirectory(pathFragment, isComplete);
        }

        return currentNode;
    }
}