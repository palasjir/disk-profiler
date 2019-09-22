import * as FS from 'fs';
import * as PATH from 'path';
import DirectoryWatcher from '../src/watcher/DirectoryWatcher';

const rimraf = require('rimraf');


const DEFAULT_FILE_CONTENT = 'Hello world!';
const INIT_FILE_NUMBER = 6;
const INIT_DIR_NUMBER = 5;
const DEFAULT_FILE_SIZE = 12;
const INIT_BYTE_SIZE = 72;
const rootPath = PATH.join(__dirname, 'fixture');

const path = (p: string) => PATH.join(rootPath, p);

const delay = async (time?: number) => {
    return new Promise((resolve) => {
        const timer = time || 500;
        setTimeout(resolve, timer);
    });
};

/*
.
├── dir1
│   ├── file3.txt
│   ├── file4.txt
│   ├── dir4
│   │   └── file5.txt
│   └── dir5
├── dir2
├── dir3
│   └── file6.txt
├── file1.txt
└── file2.txt
 */
function testSetup() {
    FS.mkdirSync(rootPath);

    FS.mkdirSync(path('/dir1'));
    FS.mkdirSync(path('/dir2'));
    FS.mkdirSync(path('/dir3'));
    FS.mkdirSync(path('/dir1/dir4'));
    FS.mkdirSync(path('/dir1/dir5'));

    FS.appendFileSync(path('/file1.txt'), DEFAULT_FILE_CONTENT);
    FS.appendFileSync(path('/file2.txt'), DEFAULT_FILE_CONTENT);
    FS.appendFileSync(path('/dir1/file3.txt'), DEFAULT_FILE_CONTENT);
    FS.appendFileSync(path('/dir1/file4.txt'), DEFAULT_FILE_CONTENT);
    FS.appendFileSync(path('/dir1/dir4/file5.txt'), DEFAULT_FILE_CONTENT);
    FS.appendFileSync(path('/dir3/file6.txt'), DEFAULT_FILE_CONTENT);
}

describe('Directory Watcher - integration tests', () => {

    let watcher: DirectoryWatcher;

    beforeEach(() => {
        const options = {debug: true, debugAfterReady: true};
        watcher = new DirectoryWatcher(rootPath, options);
        testSetup();
    });

    afterEach(() => {
        rimraf.sync(rootPath);
    });

    test('reads initial structure', async () => {
        await watcher.start();
        const tree = watcher.getDirectoryTree();

        expect(tree.head.totalNumberOfDirectories).toEqual(INIT_DIR_NUMBER);
        expect(tree.head.totalNumberOfFiles).toEqual(INIT_FILE_NUMBER);
        expect(tree.head.sizeInBytes).toEqual(INIT_BYTE_SIZE);
    }, 2500);

    test('watches directory removal - empty directory', async () => {
        await watcher.start();
        const tree = watcher.getDirectoryTree();

        FS.rmdirSync(path('/dir2'));

        await delay();

        expect(tree.head.totalNumberOfDirectories).toEqual(4);
        expect(tree.head.totalNumberOfFiles).toEqual(INIT_FILE_NUMBER);
        expect(tree.head.sizeInBytes).toEqual(INIT_BYTE_SIZE);
    }, 2500);

    test('watches directory removal - contains files', async () => {
        await watcher.start();
        const tree = watcher.getDirectoryTree();

        rimraf.sync(path('/dir3'));

        await delay();

        expect(tree.head.totalNumberOfDirectories).toEqual(4);
        expect(tree.head.totalNumberOfFiles).toEqual(5);
        expect(tree.head.sizeInBytes).toEqual(INIT_BYTE_SIZE - DEFAULT_FILE_SIZE);
    }, 2500);

    test('watches directory removal - contains files and directories', async () => {
        await watcher.start();
        const tree = watcher.getDirectoryTree();

        rimraf.sync(path('/dir1'));

        await delay();

        expect(tree.head.totalNumberOfDirectories).toEqual(INIT_DIR_NUMBER - 3);
        expect(tree.head.totalNumberOfFiles).toEqual(3);
        expect(tree.head.sizeInBytes).toEqual(INIT_BYTE_SIZE - 3 * DEFAULT_FILE_SIZE);
    }, 2500);

    test('watches file removal', async () => {
        await watcher.start();
        const tree = watcher.getDirectoryTree();

        FS.unlinkSync(path('/file1.txt'));

        await delay(5000);
        expect(tree.head.totalNumberOfDirectories).toEqual(INIT_DIR_NUMBER);
        expect(tree.head.totalNumberOfFiles).toEqual(INIT_FILE_NUMBER - 1);
        expect(tree.head.sizeInBytes).toEqual(INIT_BYTE_SIZE - DEFAULT_FILE_SIZE);

        FS.unlinkSync(path('/dir1/dir4/file5.txt'));

        await delay(5000);
        expect(tree.head.totalNumberOfDirectories).toEqual(INIT_DIR_NUMBER);
        expect(tree.head.totalNumberOfFiles).toEqual(INIT_FILE_NUMBER - 2);
        expect(tree.head.sizeInBytes).toEqual(INIT_BYTE_SIZE - 2 * DEFAULT_FILE_SIZE);

    }, 20000);

    test('watches file creation', async () => {
        await watcher.start();
        const tree = watcher.getDirectoryTree();

        FS.appendFileSync(path('/newfile1.txt'), DEFAULT_FILE_CONTENT);

        await delay(5000);
        expect(tree.head.totalNumberOfDirectories).toEqual(INIT_DIR_NUMBER);
        expect(tree.head.totalNumberOfFiles).toEqual(INIT_FILE_NUMBER + 1);
        expect(tree.head.sizeInBytes).toEqual(INIT_BYTE_SIZE + DEFAULT_FILE_SIZE);

        FS.appendFileSync(path('/dir2/newfile2.txt'), DEFAULT_FILE_CONTENT);

        await delay(5000);
        expect(tree.head.totalNumberOfDirectories).toEqual(INIT_DIR_NUMBER);
        expect(tree.head.totalNumberOfFiles).toEqual(INIT_FILE_NUMBER + 2);
        expect(tree.head.sizeInBytes).toEqual(INIT_BYTE_SIZE + 2 * DEFAULT_FILE_SIZE);

    }, 20000);

    test('watches directory creation', async () => {
        await watcher.start();
        const tree = watcher.getDirectoryTree();

        FS.mkdirSync(path('/newdir1'));

        await delay(5000);
        expect(tree.head.totalNumberOfDirectories).toEqual(INIT_DIR_NUMBER + 1);
        expect(tree.head.totalNumberOfFiles).toEqual(INIT_FILE_NUMBER);

        FS.mkdirSync(path('/dir2/newdir2'));

        await delay(5000);
        expect(tree.head.totalNumberOfDirectories).toEqual(INIT_DIR_NUMBER + 2);
        expect(tree.head.totalNumberOfFiles).toEqual(INIT_FILE_NUMBER);

    }, 20000);

    test('watches file change', async () => {
        await watcher.start();
        const tree = watcher.getDirectoryTree();

        expect(tree.head.sizeInBytes).toEqual(72);

        FS.appendFileSync(path('/file1.txt'), 'New Content 1!');

        await delay(5000);
        expect(tree.head.totalNumberOfDirectories).toEqual(INIT_DIR_NUMBER);
        expect(tree.head.totalNumberOfFiles).toEqual(INIT_FILE_NUMBER);
        expect(tree.head.sizeInBytes).toEqual(86);

        FS.appendFileSync(path('/dir1/dir4/file5.txt'), 'New Content 2!');

        await delay(5000);
        expect(tree.head.totalNumberOfDirectories).toEqual(INIT_DIR_NUMBER);
        expect(tree.head.totalNumberOfFiles).toEqual(INIT_FILE_NUMBER);
        expect(tree.head.sizeInBytes).toEqual(100);

    }, 20000);


});

