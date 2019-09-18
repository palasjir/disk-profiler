import FileNode from './FileNode';
import DirectoryNode from './DirectoryNode';

type UpdaterFunction<T> = (current: DirectoryNodeMeta) => T;

export interface DirectoryNodeMetaUpdater {
    totalNumberOfDirectories?: UpdaterFunction<number>;
    totalNumberOfFiles?: UpdaterFunction<number>;
    sizeInBytes?: UpdaterFunction<number>;
}

export interface DirectoryNodeMeta {
    totalNumberOfDirectories: number;
    totalNumberOfFiles: number;
    sizeInBytes: number;
}

export function emptyMeta(): DirectoryNodeMeta {
    return {
        totalNumberOfDirectories: 0,
        totalNumberOfFiles: 0,
        sizeInBytes: 0
    }
}


export function updateMetaData(oldValue: DirectoryNodeMeta, updater?: DirectoryNodeMetaUpdater): DirectoryNodeMeta {
    if(!updater) return  oldValue;
    const updates: DirectoryNodeMeta = {...oldValue};
    for(const key in updater) {
        if(oldValue.hasOwnProperty(key)) {
            const _key = key as keyof DirectoryNodeMeta;
            const valueUpdater = updater[_key];
            updates[_key] = valueUpdater(oldValue);
        }
    }
    return updates;
}

export function createSetDirectoryUpdater(newDir: DirectoryNode, oldDir?: DirectoryNode): DirectoryNodeMetaUpdater {

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

export function createRemoveDirectoryUpdater(dirToRemove: DirectoryNode): DirectoryNodeMetaUpdater {
    return {
        sizeInBytes: current => current.sizeInBytes - dirToRemove.sizeInBytes,
        totalNumberOfFiles: current => current.totalNumberOfFiles - dirToRemove.totalNumberOfFiles,
        totalNumberOfDirectories: current => current.totalNumberOfDirectories - dirToRemove.totalNumberOfDirectories - 1
    }
}

export function createRemoveFileUpdater(fileToRemove: FileNode): DirectoryNodeMetaUpdater {
    return {
        sizeInBytes: current => current.sizeInBytes - fileToRemove.data.size,
        totalNumberOfFiles: current => current.totalNumberOfFiles - 1
    }
}

export function createAddFileUpdater(newFile: FileNode): DirectoryNodeMetaUpdater {
    return {
        sizeInBytes: current => current.sizeInBytes + newFile.data.size,
        totalNumberOfFiles: current => current.totalNumberOfFiles + 1
    }
}

export function createAddEmptyDirectoryUpdater(): DirectoryNodeMetaUpdater {
    return {
        totalNumberOfDirectories: current => current.totalNumberOfDirectories + 1
    }
}