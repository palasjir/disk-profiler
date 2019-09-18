import DirectoryNode from './DirectoryNode';
import FileNode from './FileNode';
import {DirInfo} from '../commons/types';

export function emptyMeta(): DirInfo {
    return {
        totalNumberOfDirectories: 0,
        totalNumberOfFiles: 0,
        sizeInBytes: 0
    }
}

export type DirInfoUpdaterFn<T> = (current: DirInfo) => T;

export interface DirInfoUpdater {
    totalNumberOfDirectories?: DirInfoUpdaterFn<number>;
    totalNumberOfFiles?: DirInfoUpdaterFn<number>;
    sizeInBytes?: DirInfoUpdaterFn<number>;
}

export function updateDirInfo(oldValue: DirInfo, updater?: DirInfoUpdater): DirInfo {
    if(!updater) return  oldValue;
    const updates: DirInfo = {...oldValue};
    for(const key in updater) {
        if(oldValue.hasOwnProperty(key)) {
            const _key = key as keyof DirInfo;
            const valueUpdater = updater[_key];
            updates[_key] = valueUpdater(oldValue);
        }
    }
    return updates;
}

export function createSetDirectoryUpdater(newDir: DirectoryNode, oldDir?: DirectoryNode): DirInfoUpdater {

    const oldMeta: DirInfo = oldDir ? oldDir.dirInfo : emptyMeta();

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

export function createRemoveDirectoryUpdater(dirToRemove: DirectoryNode): DirInfoUpdater {
    return {
        sizeInBytes: current => current.sizeInBytes - dirToRemove.sizeInBytes,
        totalNumberOfFiles: current => current.totalNumberOfFiles - dirToRemove.totalNumberOfFiles,
        totalNumberOfDirectories: current => current.totalNumberOfDirectories - dirToRemove.totalNumberOfDirectories - 1
    }
}

export function createRemoveFileUpdater(fileToRemove: FileNode): DirInfoUpdater {
    const size = fileToRemove.info.size;
    return {
        sizeInBytes: current => current.sizeInBytes - size,
        totalNumberOfFiles: current => current.totalNumberOfFiles - 1
    }
}

export function createAddFileUpdater(newFile: FileNode): DirInfoUpdater {
    return {
        sizeInBytes: current => current.sizeInBytes + newFile.info.size,
        totalNumberOfFiles: current => current.totalNumberOfFiles + 1
    }
}

export function createAddEmptyDirectoryUpdater(): DirInfoUpdater {
    return {
        totalNumberOfDirectories: current => current.totalNumberOfDirectories + 1
    }
}