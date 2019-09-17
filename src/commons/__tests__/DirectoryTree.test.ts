import DirectoryTree from '../DirectoryTree';
import {FileData} from '../types';
import DirectoryNode from '../DirectoryNode';

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
            const rootPath  = '/root/path';
            const sut = new DirectoryTree(rootPath);

            sut.addDirectory(`${rootPath}/folder1`);
            expect(sut.head.getNumberOfDirectories()).toEqual(1);

            sut.addDirectory(`${rootPath}/folder2`);
            expect(sut.head.getNumberOfDirectories()).toEqual(2);
        });

        test(`can't add the same directory twice`, () => {
            const rootPath  = '/root/path';
            const sut = new DirectoryTree(rootPath);

            sut.addDirectory(`${rootPath}/folder1`);
            expect(sut.head.getNumberOfDirectories()).toEqual(1);

            sut.addDirectory(`${rootPath}/folder1`);
            expect(sut.head.getNumberOfDirectories()).toEqual(1);
        });

        test(`adds directory with complex path`, () => {
            const rootPath  = '/root/path';
            const sut = new DirectoryTree(rootPath);

            sut.addDirectory(`${rootPath}/folder1/folder1`);
            expect(sut.head.getNumberOfDirectories()).toEqual(1);
            expect(sut.head.getDirectory('folder1').getNumberOfDirectories()).toEqual(1);
        });

    });


    describe('removeDirectory', () => {

        test('removes directory from structure', () => {
            const rootPath  = '/root/path';
            const sut = new DirectoryTree(rootPath);

            sut.addFile(`${rootPath}/folder1/file1.txt`, { size: 500, lastModified: 0});
            expect(sut.head.getNumberOfDirectories()).toEqual(1);

            sut.removeDirectory(`${rootPath}/folder1`);
            expect(sut.head.getNumberOfDirectories()).toEqual(0);
        });

        test('removing directory updates size', () => {
            const rootPath  = '/root/path';
            const sut = new DirectoryTree(rootPath);

            sut.addFile(`${rootPath}/folder1/file1.txt`, { size: 500, lastModified: 0});
            expect(sut.head.sizeInBytes).toEqual(500);

            sut.removeDirectory(`${rootPath}/folder1`);
            expect(sut.head.sizeInBytes).toEqual(0);
        });

    });

    describe('removeFile', () => {

        test('removes correct file from root', () => {
            const rootPath  = '/root/path';
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


});
