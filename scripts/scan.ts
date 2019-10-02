import {formatSize} from "../src/utils/format"
import DirectoryWatcher, {WatcherOptions} from "../src/watcher/DirectoryWatcher"

const pathToScan = ""

let isReady = false

const watcherOptions: WatcherOptions = {
    onDirRemoved(path: string): void {
        if (isReady) {
            console.log(
                "dir removed",
                path,
                formatSize(watcher.tree.head.sizeInBytes)
            )
        }
    },
    onDirAdded(path: string): void {
        if (isReady) {
            console.log(
                "dir added",
                path,
                formatSize(watcher.tree.head.sizeInBytes)
            )
        }
    },
    onFileRemoved(path: string): void {
        if (isReady) {
            console.log(
                "file removed",
                path,
                formatSize(watcher.tree.head.sizeInBytes)
            )
        }
    },
    onFileChanged(path: string): void {
        if (isReady) {
            console.log(
                "file updated",
                path,
                formatSize(watcher.tree.head.sizeInBytes)
            )
        }
    },
    onFileAdded(path: string): void {
        if (isReady) {
            console.log(
                "file added",
                path,
                formatSize(watcher.tree.head.sizeInBytes)
            )
        }
    },
    onReady(): void {
        isReady = true
        console.dir(watcher.tree)
    },
}

const watcher = new DirectoryWatcher(pathToScan, watcherOptions)
