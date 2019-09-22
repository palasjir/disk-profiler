import DirectoryTree from '../DirectoryTree';
import {FileInfo} from '../../commons/types';
import DirectoryNode from '../DirectoryNode';

const rootPath  = '/root/path';
const defaultFileData: FileInfo = { size: 500, lastModified: 0};

describe('DirectoryTree', () => {

    describe('constructor', () => {

        test('creates root path with ending slash', () => {
            let sut = new DirectoryTree('/root/path');
            expect(sut.rootPath).toEqual('/root/path/');

            sut = new DirectoryTree('/root/path/');
            expect(sut.rootPath).toEqual('/root/path/');

            sut = new DirectoryTree('/');
            expect(sut.rootPath).toEqual('/');

            sut = new DirectoryTree('');
            expect(sut.rootPath).toEqual('/');
        });
    });

    describe('addDirectory', () => {

        test('adds directory', () => {
            const sut = new DirectoryTree(rootPath);

            sut.addEmptyDirectory(`${rootPath}/folder1`);
            expect(sut.head.getNumberOfDirectories()).toEqual(1);

            sut.addEmptyDirectory(`${rootPath}/folder2`);
            expect(sut.head.getNumberOfDirectories()).toEqual(2);
        });

        test(`can't add the same directory twice`, () => {
            const sut = new DirectoryTree(rootPath);

            sut.addEmptyDirectory(`${rootPath}/folder1`);
            expect(sut.head.getNumberOfDirectories()).toEqual(1);

            sut.addEmptyDirectory(`${rootPath}/folder1`);
            expect(sut.head.getNumberOfDirectories()).toEqual(1);
        });

        test(`adds directory with complex path`, () => {
            const sut = new DirectoryTree(rootPath);

            sut.addEmptyDirectory(`${rootPath}/folder1/folder1`);
            expect(sut.head.getNumberOfDirectories()).toEqual(1);
            expect(sut.head.getDirectory('folder1').getNumberOfDirectories()).toEqual(1);
        });

    });

    describe('addFile()', () => {
        test("adding file to nested directory that does't exist increases total number of directories and files", () => {
            let sut = new DirectoryTree(rootPath);
            expect(sut.head.totalNumberOfFiles).toEqual(0);
            expect(sut.head.totalNumberOfDirectories).toEqual(0);

            sut.addFile(`${rootPath}/nested1/file.txt`, defaultFileData);

            expect(sut.head.totalNumberOfFiles).toEqual(1);
            expect(sut.head.totalNumberOfDirectories).toEqual(1);
        });

        test("adding file to nested directory that exists increases total number of directories and files", () => {
            let sut = new DirectoryTree(rootPath);
            sut.addEmptyDirectory(`${rootPath}/dir1`);

            expect(sut.head.totalNumberOfFiles).toEqual(0);
            expect(sut.head.totalNumberOfDirectories).toEqual(1);

            sut.addFile(`${rootPath}/dir1/nested1/file.txt`, defaultFileData);

            expect(sut.head.totalNumberOfFiles).toEqual(1);
            expect(sut.head.totalNumberOfDirectories).toEqual(2);
        });

    });

    describe('removeDirectory', () => {

        test('removes directory from structure', () => {
            const sut = new DirectoryTree(rootPath);

            sut.addFile(`${rootPath}/folder1/file1.txt`, { size: 500, lastModified: 0});
            expect(sut.head.getNumberOfDirectories()).toEqual(1);

            sut.removeDirectory(`${rootPath}/folder1`);
            expect(sut.head.getNumberOfDirectories()).toEqual(0);
        });

        test('removing directory updates size', () => {
            const sut = new DirectoryTree(rootPath);

            sut.addFile(`${rootPath}/folder1/file1.txt`, { size: 500, lastModified: 0});
            expect(sut.head.sizeInBytes).toEqual(500);

            sut.removeDirectory(`${rootPath}/folder1`);
            expect(sut.head.sizeInBytes).toEqual(0);
        });

    });

    describe('removeFile', () => {

        test('removes correct file from root', () => {
            
            const sut = new DirectoryTree(rootPath);

            sut.addFile(`${rootPath}/file1.txt`, { size: 500, lastModified: 0});
            sut.addFile(`${rootPath}/file2.txt`, { size: 500, lastModified: 0});
            expect(sut.head.getNumberOfFiles()).toEqual(2);

            sut.removeFile(`${rootPath}/file1.txt`);
            expect(sut.head.getNumberOfFiles()).toEqual(1);
            expect(sut.head.getFile(`file1.txt`)).not.toBeDefined();
            expect(sut.head.getFile(`file2.txt`)).toBeDefined();
        });

    });
    
    describe('findDirectory', () => {
       
        test("gives correct directory when directory exists", () => {
            const sut = new DirectoryTree(rootPath);
            const folder = sut.addEmptyDirectory(`${rootPath}/folder`);
            const found = sut.findDirectory(`${rootPath}/folder`);
            expect(found).toBe(folder);
        });
        
        test("gives null when directory doesn't exist", () => {
            const sut = new DirectoryTree(rootPath);
            const folder = sut.addEmptyDirectory(`${rootPath}/folder`);
            const found = sut.findDirectory(`${rootPath}/nonExisting`);
            expect(found).toBeNull();
            expect(sut.head.getDirectory('folder')).toBe(folder)
        })
        
    });

    describe('findFile()', () => {

        test("gives correct file when file exists", () => {
            const sut = new DirectoryTree(rootPath);
            const folder = sut.addEmptyDirectory(`${rootPath}/folder`);
            const file = folder.addFile('file.txt', defaultFileData);
            const found = sut.findFile(`${rootPath}/folder/file.txt`);
            expect(found).toBe(file);
        });

        test("gives null when directory doesn't exist", () => {
            const sut = new DirectoryTree(rootPath);
            sut.addEmptyDirectory(`${rootPath}/folder`);
            const found = sut.findFile(`${rootPath}/folder/nonExisting.txt`);
            expect(found).toBeUndefined();
        })

    });

    describe('removeDirectory', () => {

        test("removes directory from structure", () => {
            const sut = new DirectoryTree(rootPath);
            const folder = sut.addEmptyDirectory(`${rootPath}/folder`);
            const nested1 = folder.addEmptyDirectory('nested1');
            const nested2 = folder.addEmptyDirectory('nested2');
            const removed = sut.removeDirectory(`${rootPath}/folder/nested1`);

            expect(removed).toBe(nested1);
            expect(folder.getDirectory('nested2')).toBe(nested2);
        });

        test("doesnt cause any side effect when file does not exist", () => {
            const sut = new DirectoryTree(rootPath);
            const folder = sut.addEmptyDirectory(`${rootPath}/folder`);
            const nested1 = folder.addEmptyDirectory('nested1');
            const nested2 = folder.addEmptyDirectory('nested2');
            const removed = sut.removeDirectory(`${rootPath}/folder/nested3`);

            expect(removed).toBeUndefined();
            expect(folder.getDirectory('nested1')).toBe(nested1);
            expect(folder.getDirectory('nested2')).toBe(nested2);
        });

    });

    describe('removeFile', () => {

        test("removes file from structure", () => {
            const sut = new DirectoryTree(rootPath);
            const folder = sut.addEmptyDirectory(`${rootPath}/folder`);
            const file1 = folder.addFile('file1.txt', defaultFileData);
            const file2 = folder.addFile('file2.txt', defaultFileData);
            const removed = sut.removeFile(`${rootPath}/folder/file1.txt`);

            expect(removed).toBe(file1);
            expect(folder.getFile('file1.txt')).toBeUndefined();
            expect(folder.getFile('file2.txt')).toBe(file2);
        });

        test("doesnt cause any side effect when file does not exist", () => {
            const sut = new DirectoryTree(rootPath);
            const folder = sut.addEmptyDirectory(`${rootPath}/folder`);
            const file1 = folder.addFile('file1.txt', defaultFileData);
            const file2 = folder.addFile('file2.txt', defaultFileData);
            const removed = sut.removeFile(`${rootPath}/folder/doesNotExist.txt`);

            expect(removed).toBeUndefined();
            expect(folder.getFile('file1.txt')).toBe(file1);
            expect(folder.getFile('file2.txt')).toBe(file2);
        });

    });


});
