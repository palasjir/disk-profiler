import DirectoryTree from "../models/DirectoryTree"
import * as chokidar from "chokidar"
import * as FS from "fs"
import {noop} from "../utils/base"
import {statsToFileData} from "../utils/stats"
import {extractFileListFromTree} from "../utils/tree"
import DebugLogger from "./DebugLogger"
import {SortedFileList} from "./SortedFileList"
import {NormalizedPath} from "../utils/NormalizedPath"
import {normalizePath} from "../utils/path"

export interface WatcherOptions {
    debug?: boolean
    debugAfterReady?: boolean
    onFileAdded?(path: string): void
    onFileChanged?(path: string): void
    onFileRemoved?(path: string): void
    onDirAdded?(path: string): void
    onDirRemoved?(path: string): void
    onReady?(): void
    onError?(error?: any): void
}

const WATCHER_CONFIG = {
    persistent: true,
    followSymlinks: false,
    disableGlobbing: true,
    awaitWriteFinish: true,
    alwaysStat: true,
}

const DEFAULT_OPTIONS: WatcherOptions = {
    debug: false,
    debugAfterReady: false,
    onReady: noop,
    onError: noop,
    onFileAdded: noop,
    onFileChanged: noop,
    onFileRemoved: noop,
    onDirRemoved: noop,
    onDirAdded: noop,
}

const NUMBER_OF_FILES_BATCH = 100

export default class DirectoryWatcher {
    private logger: DebugLogger = new DebugLogger()
    private path: NormalizedPath
    private watcher: chokidar.FSWatcher | null
    private _tree: DirectoryTree
    private _topFiles?: SortedFileList
    private options: WatcherOptions
    private showNumberOfFiles = NUMBER_OF_FILES_BATCH

    constructor(path: NormalizedPath, options?: WatcherOptions) {
        this.path = path
        this.options = {
            ...DEFAULT_OPTIONS,
            ...options,
        }
        this.logger.debug = Boolean(options && options.debug)
        this.logger.afterReady = Boolean(options && options.debugAfterReady)
    }

    public start(): Promise<void> {
        if (this.watcher) {
            return Promise.reject(new Error("Watcher is already running!"))
        }
        this._tree = new DirectoryTree(this.path)
        this._topFiles = undefined
        return new Promise((resolve, reject) => {
            this.watcher = chokidar.watch(
                this.path.asAbsolutePlatformSpecificPath(),
                WATCHER_CONFIG
            )
            this.watcher
                .on("error", e => {
                    this.onError(e)
                    reject(e)
                })
                .on("ready", () => {
                    this.onReady()
                    resolve()
                })
                .on("unlinkDir", this.onDirRemoved.bind(this))
                .on("unlink", this.onFileRemoved.bind(this))
                .on("addDir", this.onDirAdded.bind(this))
                .on("add", this.onFileAdded.bind(this))
                .on("change", this.onFileChanged.bind(this))
        })
    }

    public initTopFiles() {
        const files = extractFileListFromTree(this.tree)
        this._topFiles = new SortedFileList(files)
    }

    private onReady() {
        this.logger.isReady = true
        this.logger.log("Ready!")
        if (this.options.onReady) {
            this.options.onReady()
        }
    }

    private onError(error: any) {
        this.logger.log(`Error: ${error}`)
        if (this.options.onError) {
            this.options.onError(error)
        }
    }

    private onDirRemoved(path: string) {
        this.logger.log(`Removing directory: ${path}`)
        this._tree.removeDirectory(normalizePath(path))
        if (this.options.onDirRemoved) {
            this.options.onDirRemoved(path)
        }
    }

    private onFileRemoved(path: string) {
        this.logger.log(`Removing file: ${path}`)
        const removed = this._tree.removeFile(normalizePath(path))
        if (removed && this._topFiles) {
            this._topFiles.remove(removed.info)
        }
        if (removed && this.options.onFileRemoved) {
            this.options.onFileRemoved(path)
        }
    }

    private onDirAdded(path: string) {
        this.logger.log(`Adding directory: ${path}`)
        this._tree.addEmptyDirectory(normalizePath(path))
        if (this.options.onDirAdded) {
            this.options.onDirAdded(path)
        }
    }

    private onFileAdded(path: string, stats?: FS.Stats) {
        this.logger.log(`Adding file: ${path}`)

        if (!stats) return

        const fileInfo = statsToFileData(path, stats)
        this._tree.addFile(normalizePath(path), fileInfo)
        if (this._topFiles) {
            this._topFiles.add(fileInfo)
        }
        if (this.options.onFileAdded) {
            this.options.onFileAdded(path)
        }
    }

    private onFileChanged(path: string, stats?: FS.Stats) {
        this.logger.log(`Changing file: ${path}`)

        if (!stats) return

        const fileInfo = statsToFileData(path, stats)
        const updateResult = this._tree.updateFile(
            normalizePath(path),
            fileInfo
        )
        if (updateResult && this._topFiles) {
            this._topFiles.update(fileInfo)
        }
        if (updateResult && this.options.onFileChanged) {
            this.options.onFileChanged(path)
        }
    }

    public stop() {
        if (this.watcher) {
            this.watcher.close()
            this.watcher = null
        }
    }

    public get tree() {
        return this._tree
    }

    public get topFiles() {
        if (!this._topFiles) return []
        return this._topFiles.getRange(this.showNumberOfFiles)
    }

    public moreFiles() {
        this.showNumberOfFiles += NUMBER_OF_FILES_BATCH
    }
}
