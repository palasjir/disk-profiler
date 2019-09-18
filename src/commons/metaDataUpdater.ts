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
    const updates: DirectoryNodeMeta = {
        ...oldValue
    };
    for(const key in updater) {
        if(oldValue.hasOwnProperty(key)) {
            const _key = key as keyof DirectoryNodeMeta;
            const valueUpdater = updater[_key];
            updates[_key] = valueUpdater(oldValue);
        }
    }

    return updates;
}