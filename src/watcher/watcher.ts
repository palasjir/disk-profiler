import * as chokidar from 'chokidar';
import * as FS from 'fs';
import {FileData} from '../commons/types';
import DirectoryTree from '../models/DirectoryTree';
import {getStats} from '../utils/scanner';


export interface WatcherOptions {
    onFileAdded?(path: string): void;
    onFileChanged?(path: string): void;
    onFileRemoved?(path: string): void;
    onDirAdded?(path: string): void;
    onDirRemoved?(path: string): void;
    onReady?(): void;
    onError?(error: any): void;
}


function statsToFileData(stats?: FS.Stats): FileData {
    if(!stats) {
        return {
            size: 0,
            lastModified: 0
        }
    }
    return {
        size: stats.size,
        lastModified: stats.mtimeMs
    }
}

export function createDirectoryTreeWatcher(path: string, options?: WatcherOptions): [chokidar.FSWatcher, DirectoryTree] {
    const tree = new DirectoryTree(path);

    const watcherOptions: WatcherOptions = {
        onDirRemoved(path: string): void {
            tree.removeDirectory(path);
            if(options.onDirRemoved) {
                options.onDirRemoved(path);
            }
        },
        onDirAdded(path: string): void {
            tree.addEmptyDirectory(path);
            if(options.onDirAdded) {
                options.onDirAdded(path);
            }
        },
        onFileRemoved(path: string): void {
            tree.removeFile(path);
            if(options.onFileRemoved) {
                options.onFileRemoved(path);
            }
        },
        onFileChanged(path: string): void {
            if(options.onFileChanged) {
                options.onFileChanged(path);
            }
        },
        onFileAdded(path: string): void {
            const stats = getStats(path);
            const fileData = statsToFileData(stats);

            tree.addFile(path, fileData);
            if(options.onFileAdded) {
                options.onFileAdded(path);
            }
        },
        onReady(): void {
            if(options.onReady) {
                options.onReady();
            }
        },
        onError(error): void {
            if(options.onError) {
                options.onError(error);
            }
        }
    };
    const watcher = createFileWatcher(path, watcherOptions);
    return [watcher, tree]
}

export function createFileWatcher(path: string, options: WatcherOptions) {
    const watcher = chokidar.watch(path, {
        persistent: true,
        followSymlinks: false,
        disableGlobbing: true,
    });

    watcher
        .on('unlinkDir', options.onDirRemoved)
        .on('addDir', options.onDirAdded)
        .on('add', options.onFileAdded)
        .on('change', options.onFileChanged)
        .on('unlink', options.onFileRemoved)
        .on('ready', options.onReady)
        .on('error', options.onError);

    return watcher;
}