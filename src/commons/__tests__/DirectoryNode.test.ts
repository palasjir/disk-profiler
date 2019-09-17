import DirectoryNode from '../DirectoryNode';
import {FileData} from '../types';

const defaultFileData: FileData = {size: 500, lastModified: 0};

describe('DirectoryNode', () => {

    describe('addFile', () => {
        test('adds non existing file', () => {
            const sut = new DirectoryNode('.');
            const nodeData: FileData = {
                size: 1024,
                lastModified: 0
            };
            sut.addFile('file1', nodeData);
            expect(sut.getNumberOfDirectories()).toEqual(0);
            expect(sut.getNumberOfFiles()).toEqual(1);

            sut.addFile('file2', nodeData);
            expect(sut.getNumberOfDirectories()).toEqual(0);
            expect(sut.getNumberOfFiles()).toEqual(2);
        });

        test('adding file updates size', () => {
            const sut = new DirectoryNode('.');
            sut.addFile('file1', {
                size: 2000,
                lastModified: 0
            });
            expect(sut.sizeInBytes).toEqual(2000);

            sut.addFile('file2', {
                size: 3000,
                lastModified: 0
            });
            expect(sut.sizeInBytes).toEqual(5000);
        });
    });

    describe('addDirectory', () => {
        test('adds non exiting directory', () => {
            const sut = new DirectoryNode('.');

            sut.addEmptyDirectory('folder1');
            expect(sut.getNumberOfDirectories()).toEqual(1);

            sut.addEmptyDirectory('folder2');
            expect(sut.getNumberOfDirectories()).toEqual(2);
        });
    });

    describe('setDirectory', () => {

        test('setting directory', () => {
            const sut = new DirectoryNode('.');

            expect(sut.getDirectory('folder1')).not.toBeDefined();

            const folder = new DirectoryNode('folder1');
            folder.addFile('file1', { size: 500, lastModified: 0});
            folder.addFile('file2', { size: 500, lastModified: 0});

            sut.setDirectory('folder1', folder);
            expect(sut.getDirectory('folder1')).toBeDefined();
        });

        test('setting new directory updates size', () => {
            const sut = new DirectoryNode('.');

            expect(sut.sizeInBytes).toEqual(0);

            const folder = new DirectoryNode('folder1');
            folder.addFile('file1', { size: 500, lastModified: 0});
            folder.addFile('file2', { size: 500, lastModified: 0});

            sut.setDirectory('folder1', folder);
            expect(sut.sizeInBytes).toEqual(1000);
        });

        test('setting additional directory updates size', () => {
            const sut = new DirectoryNode('.');

            expect(sut.sizeInBytes).toEqual(0);

            const folder = new DirectoryNode('folder1');
            folder.addFile('file1', { size: 500, lastModified: 0});
            folder.addFile('file2', { size: 500, lastModified: 0});

            sut.setDirectory('folder1', folder);
            expect(sut.sizeInBytes).toEqual(1000);

            const folder2 = new DirectoryNode('folder2');
            folder2.addFile('file1', { size: 500, lastModified: 0});
            folder2.addFile('file2', { size: 500, lastModified: 0});

            expect(sut.sizeInBytes).toEqual(1000);
        });

        test('setting existing directory updates size', () => {
            const sut = new DirectoryNode('.');

            expect(sut.sizeInBytes).toEqual(0);

            const folder = new DirectoryNode('folder1');
            folder.addFile('file1', { size: 500, lastModified: 0});
            folder.addFile('file2', { size: 500, lastModified: 0});

            sut.setDirectory('folder1', folder);
            expect(sut.sizeInBytes).toEqual(1000);

            const updatedFolder1 = new DirectoryNode('folder1');
            updatedFolder1.addFile('file1', { size: 500, lastModified: 0});
            updatedFolder1.addFile('file2', { size: 500, lastModified: 0});
            updatedFolder1.addFile('file3', { size: 500, lastModified: 0});

            sut.setDirectory('folder1', updatedFolder1);
            expect(sut.sizeInBytes).toEqual(1500);
        });

        test('setting existing directory updates parent size', () => {
            const sut = new DirectoryNode('.');

            expect(sut.sizeInBytes).toEqual(0);

            const parentFolder = new DirectoryNode('parentFolder');
            parentFolder.addFile('file1', { size: 500, lastModified: 0});
            parentFolder.addFile('file2', { size: 500, lastModified: 0});
            expect(parentFolder.sizeInBytes).toEqual(1000);

            const folder = new DirectoryNode('folder');
            folder.addFile('file1', { size: 500, lastModified: 0});
            folder.addFile('file2', { size: 500, lastModified: 0});
            folder.addFile('file3', { size: 500, lastModified: 0});
            expect(folder.sizeInBytes).toEqual(1500);

            parentFolder.setDirectory('folder', folder);
            expect(parentFolder.sizeInBytes).toEqual(2500);

            sut.setDirectory('parentFolder', parentFolder);
            expect(sut.sizeInBytes).toEqual(2500);

            const updatedFolder = new DirectoryNode('folder');
            updatedFolder.addFile('file1', { size: 500, lastModified: 0});
            updatedFolder.addFile('file2', { size: 500, lastModified: 0});
            expect(updatedFolder.sizeInBytes).toEqual(1000);

            parentFolder.setDirectory('folder', updatedFolder);
            expect(parentFolder.sizeInBytes).toEqual(2000);
            expect(sut.sizeInBytes).toEqual(2000);
        });

    });

    describe('removeDirectory', () => {

        test('removes directory', () => {
            const sut = new DirectoryNode('.');
            sut.addEmptyDirectory('folder1');
            sut.addEmptyDirectory('folder2');
            expect(sut.getNumberOfDirectories()).toEqual(2);

            sut.removeDirectory('folder1');
            expect(sut.getDirectory('folder1')).not.toBeDefined();
            expect(sut.getDirectory('folder2')).toBeDefined();
        });

        test('removing directory with files updates size', () => {

        })
    });


    describe('remove file', () => {

        test('removes existing file', () => {
            const sut = new DirectoryNode('.');
            sut.addFile('file1', defaultFileData);
            expect(sut.getNumberOfFiles()).toEqual(1);
            sut.removeFile('file1');
            expect(sut.getNumberOfFiles()).toEqual(0);
        });

        test('does nothing when removing non existing file', () => {
            const sut = new DirectoryNode('.');
            sut.addFile('file1', defaultFileData);
            expect(sut.getNumberOfFiles()).toEqual(1);
            sut.removeFile('file2');
            expect(sut.getNumberOfFiles()).toEqual(1);
        });

        test('updates size when file removed', () => {
            const sut = new DirectoryNode('.');
            sut.addFile('file1', defaultFileData);
            expect(sut.sizeInBytes).toEqual(500);
            sut.removeFile('file1');
            expect(sut.sizeInBytes).toEqual(0);
        });

        test('updates parent size when file removed', () => {
            const sut = new DirectoryNode('.');
            sut.addFile('file1', defaultFileData);

            const folder = new DirectoryNode('folder');
            folder.addFile('file1', { size: 500, lastModified: 0});
            folder.addFile('file2', { size: 500, lastModified: 0});
            sut.setDirectory('folder', folder);

            expect(sut.sizeInBytes).toEqual(1500);
            folder.removeFile('file1');
            expect(sut.sizeInBytes).toEqual(1000);
        });

        test('does not update parent size when file does not exist', () => {
            const sut = new DirectoryNode('.');
            sut.addFile('file1', defaultFileData);

            const folder = new DirectoryNode('folder');
            folder.addFile('file1', { size: 500, lastModified: 0});
            folder.addFile('file2', { size: 500, lastModified: 0});
            sut.setDirectory('folder', folder);

            expect(sut.sizeInBytes).toEqual(1500);
            folder.removeFile('notExistingFile');
            expect(sut.sizeInBytes).toEqual(1500);
        });


    })
});
