import DirectoryTree from '../models/DirectoryTree';
import {createDirectoryTreeWatcher, statsToFileData, WatcherOptions} from './watcher';
import * as chokidar from 'chokidar';
import * as FS from 'fs';
import {getStats} from '../utils/scanner';
import {noop} from '../utils/base';

const WATCHER_OPTIONS = {
    persistent: true,
    followSymlinks: false,
    disableGlobbing: true,
    awaitWriteFinish: true
};

const DEFAULT_OPTIONS: WatcherOptions = {
    debug: false,
    debugAfterReady: false,
    onReady: noop,
    onError: noop,
    onFileAdded: noop,
    onFileChanged: noop,
    onFileRemoved: noop,
    onDirRemoved: noop,
    onDirAdded: noop
};

class DebugLogger {

    public debug: boolean;
    public afterReady: boolean;
    public isReady: boolean;

    public canLog() {
        if(!this.debug) return false;
        return !(this.afterReady && !this.isReady);

    }

    public log(value: string) {
        if(!this.canLog()) return;
        console.log(value);
    }
}

export default class DirectoryWatcher {

    private log: DebugLogger = new DebugLogger();
    private path: string;
    private watcher: chokidar.FSWatcher;
    private tree: DirectoryTree;
    private options: WatcherOptions;

    constructor(path: string, options?: WatcherOptions) {
        this.path = path;
        this.options = {
            ...DEFAULT_OPTIONS,
            ...options
        };
        this.log.debug = options && options.debug;
        this.log.afterReady = options && options.debugAfterReady;
    }

    public start(): Promise<void> {
        if(this.watcher) {
            return Promise.reject(new Error('Watcher is already running!'));
        }
        this.tree = new DirectoryTree(this.path);
        return new Promise((resolve, reject) => {
            this.watcher = chokidar.watch(this.path, WATCHER_OPTIONS);
            this.watcher
                .on('error', e => {
                    this.onError(e);
                    reject(e);
                })
                .on('ready', () => {
                    this.onReady();
                    resolve();
                })
                .on('unlinkDir', this.onDirRemoved.bind(this))
                .on('unlink', this.onFileRemoved.bind(this))
                .on('addDir', this.onDirAdded.bind(this))
                .on('add', this.onFileAdded.bind(this))
                .on('change', this.onFileChanged.bind(this))
        })
    }

    private onReady() {
        this.log.isReady = true;
        this.log.log('Ready!');
        this.options.onReady();
    }

    private onError(error: any) {
        this.log.log(`Error: ${error}`);
        this.options.onError(error);
    }

    private onDirRemoved(path: string) {
        this.log.log(`Removing directory: ${path}`);
        this.tree.removeDirectory(path);
        this.options.onDirRemoved(path)
    }

    private onFileRemoved(path: string) {
        this.log.log(`Removing file: ${path}`);
        this.tree.removeFile(path);
        this.options.onFileRemoved(path);
    }

    private onDirAdded(path: string) {
        this.log.log(`Adding directory: ${path}`);
        this.tree.addEmptyDirectory(path);
        this.options.onDirAdded(path);
    }

    private onFileAdded(path: string, stats?: FS.Stats) {
        this.log.log(`Adding file: ${path}`);
        const fileInfo = statsToFileData(FS.statSync(path));
        this.tree.addFile(path, fileInfo);
        this.options.onFileAdded(path);
    }

    private onFileChanged(path: string, stats?: FS.Stats) {
        this.log.log(`Changing file: ${path}`);
        const fileInfo = statsToFileData(FS.statSync(path));
        this.tree.updateFile(path, fileInfo);
        this.options.onFileChanged(path);
    }

    public stop() {
        this.watcher.close();
        this.watcher = null;
    }

    public getDirectoryTree() {
        return this.tree;
    }

}