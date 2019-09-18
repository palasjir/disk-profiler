// Character that we will use for trie tree root.
import DirectoryNode from './DirectoryNode';
import FileNode from './FileNode';
import {fragmentizePath, normalizeRoot} from '../utils/path';
import {FileData} from '../commons/types';

const HEAD_CHARACTER = '.';

export default class DirectoryTree {

    readonly rootPath: string;
    readonly head: DirectoryNode;

    public constructor(rootPath: string) {
        this.head = new DirectoryNode(HEAD_CHARACTER);
        this.rootPath = normalizeRoot(rootPath);
    }

    public hasSameRoot(path: string) {
        return path.startsWith(this.rootPath);
    }

    public getPathFragments(path: string) {
        return fragmentizePath(this.rootPath, path);
    }

    public addEmptyDirectory(path: string): DirectoryNode {
        if(!this.hasSameRoot(path)){
            return null;
        }
        const pathFragments = this.getPathFragments(path);
        return this.createDirectoryStructure(pathFragments);
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

    public removeDirectory(path: string): DirectoryNode {
        const pathFragments = this.getPathFragments(path);
        const directoryParent = this.findDirectory(path, true);
        const toRemove = pathFragments[pathFragments.length - 1];
        return directoryParent.removeDirectory(toRemove);
    }

    /**
     *
     * @param path - path to file
     * @return removed file
     */
    public removeFile(path: string): FileNode | undefined {
        const pathFragments = this.getPathFragments(path);
        const directoryParent = this.findDirectory(path, true);
        const toRemove = pathFragments[pathFragments.length - 1];
        return directoryParent.removeFile(toRemove);
    }

    public doesDirectoryExist(path: string): boolean {
        return Boolean(this.findDirectory(path));
    }

    public findDirectory(path: string, returnParent?: boolean): DirectoryNode | null {
        const pathFragments = this.getPathFragments(path);
        let currentNode = this.head;

        const end = returnParent ? pathFragments.length - 1 : pathFragments.length;

        for (let charIndex = 0; charIndex < end; charIndex += 1) {
            if (!currentNode.hasDirectory(pathFragments[charIndex])) {
                return null;
            }

            currentNode = currentNode.getDirectory(pathFragments[charIndex]);
        }

        return currentNode;
    }

    public findFile(path: string): FileNode | null {
        const containingDirectory = this.findDirectory(path, true);
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
            const pathFragment = pathFragments[pathFragmentIndex];
            currentNode = currentNode.addEmptyDirectory(pathFragment);
        }

        return currentNode;
    }
}