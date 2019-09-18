import {createDirectoryTreeWatcher, WatcherOptions} from '../src/commons/watcher';
import {formatSize} from '../src/utils/format';

const pathToScan1 = "/Users/jirpal/Downloads/skolka-praminek";
const pathToScan2 = "/Users/jirpal/dev/skolka-praminek";

const pathToScan = pathToScan2;

let isReady = false;

const watcherOptions: WatcherOptions = {
    onDirRemoved(path: string): void {
        if(isReady) {
            console.log('dir removed', path, formatSize(tree.head.sizeInBytes));
        }
    },
    onDirAdded(path: string): void {
        if(isReady) {
            console.log('dir added', path, formatSize(tree.head.sizeInBytes));
        }
    },
    onFileRemoved(path: string): void {
        if(isReady) {
            console.log('file removed', path, formatSize(tree.head.sizeInBytes));
        }
    },
    onFileChanged(path: string): void {
        // tree.updateFile();
    },
    onFileAdded(path: string): void {
        if(isReady) {
            console.log('file added', path, formatSize(tree.head.sizeInBytes));
        }
    },
    onReady(): void {
        isReady = true;
        console.dir(tree);
    }
};

const [watcher, tree] = createDirectoryTreeWatcher(pathToScan, watcherOptions);