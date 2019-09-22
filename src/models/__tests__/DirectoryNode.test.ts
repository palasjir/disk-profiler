import DirectoryNode from '../DirectoryNode';
import {FileInfo} from '../../commons/types';

const defaultFileData: FileInfo = {size: 500, lastModified: 0};

describe('DirectoryNode', () => {

    describe('addFile', () => {
        test('adds non existing file', () => {
            const sut = new DirectoryNode('.');
            const nodeData: FileInfo = {
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

        test('adding file updates total number of files', () => {
            const sut = new DirectoryNode('.');
            expect(sut.totalNumberOfFiles).toEqual(0);
            sut.addFile('file1', defaultFileData);
            expect(sut.totalNumberOfFiles).toEqual(1);
        });

        test('adding file updates total number of files in parent', () => {
            const sut = new DirectoryNode('.');
            sut.addFile('file1', defaultFileData);
            sut.addFile('file2', defaultFileData);

            const directory = sut.addEmptyDirectory('folder');
            expect(sut.totalNumberOfFiles).toEqual(2);
            directory.addFile('file3', defaultFileData);
            expect(sut.totalNumberOfFiles).toEqual(3);
        });

        test('adding same file twice does not increase total number of files', () => {
            const sut = new DirectoryNode('.');
            sut.addFile('file1', defaultFileData);
            expect(sut.totalNumberOfFiles).toEqual(1);
            sut.addFile('file1', defaultFileData);
            expect(sut.totalNumberOfFiles).toEqual(1);
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

        test('adding directory updates total number of directories', () => {
            const sut = new DirectoryNode('.');
            expect(sut.totalNumberOfDirectories).toEqual(0);
            sut.addEmptyDirectory('folder');
            expect(sut.totalNumberOfDirectories).toEqual(1);
        });

        test('adding directory updates total number of directories of parent', () => {
            const sut = new DirectoryNode('.');
            const folder = sut.addEmptyDirectory('folder1');
            expect(sut.totalNumberOfDirectories).toEqual(1);
            folder.addEmptyDirectory('folder2');
            expect(sut.totalNumberOfDirectories).toEqual(2);
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

        test('setting not existing directory updates number of files and folder', () => {
            const sut = new DirectoryNode('.');
            sut.addFile('file1', defaultFileData);
            sut.addEmptyDirectory('folder1');
            sut.addEmptyDirectory('folder2');

            expect(sut.totalNumberOfDirectories).toEqual(2);
            expect(sut.totalNumberOfFiles).toEqual(1);

            const folder3 = new DirectoryNode('folder3');
            folder3.addFile('file1', defaultFileData);
            folder3.addFile('file2', defaultFileData);
            folder3.addEmptyDirectory('folder4');
            folder3.addEmptyDirectory('folder5');

            sut.setDirectory('folder3', folder3);

            expect(sut.totalNumberOfFiles).toEqual(3);
            expect(sut.totalNumberOfDirectories).toEqual(5);
        });

        test('setting existing directory updates number of files and folder', () => {
            const sut = new DirectoryNode('.');
            sut.addFile('file1', defaultFileData);
            sut.addEmptyDirectory('folder1');
            sut.addEmptyDirectory('folder2');
            sut.addEmptyDirectory('folder3');

            expect(sut.totalNumberOfDirectories).toEqual(3);
            expect(sut.totalNumberOfFiles).toEqual(1);

            const folder3 = new DirectoryNode('folder3');
            folder3.addFile('file1', defaultFileData);
            folder3.addFile('file2', defaultFileData);
            folder3.addEmptyDirectory('folder4');
            folder3.addEmptyDirectory('folder5');

            sut.setDirectory('folder3', folder3);

            expect(sut.totalNumberOfFiles).toEqual(3);
            expect(sut.totalNumberOfDirectories).toEqual(5);
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

        test('removing non existing directory doesnt cause the side effect', () => {
            const sut = new DirectoryNode('.');
            sut.addEmptyDirectory('folder1');
            expect(sut.getDirectory('folder1')).toBeDefined();

            sut.removeDirectory('folder2');
            expect(sut.getDirectory('folder1')).toBeDefined();
        });

        test('removing directory with files updates size', () => {
            const sut = new DirectoryNode('.');
            sut.addFile('file1', defaultFileData);
            const folder1 =  sut.addEmptyDirectory('folder1');
            folder1.addFile('file1', defaultFileData);
            folder1.addFile('file2', defaultFileData);

            expect(sut.sizeInBytes).toEqual(1500);

            sut.removeDirectory('folder1');
            expect(sut.sizeInBytes).toEqual(500);
        });

        test('removing nested directory with files updates size', () => {
            const sut = new DirectoryNode('.');
            sut.addFile('file1', defaultFileData);
            const folder1 =  sut.addEmptyDirectory('folder1');
            const nested = folder1.addEmptyDirectory('nested');
            nested.addFile('file1', defaultFileData);
            nested.addFile('file2', defaultFileData);

            expect(sut.sizeInBytes).toEqual(1500);

            folder1.removeDirectory('nested');
            expect(sut.sizeInBytes).toEqual(500);
        });

        test('removing directory updates number of files and directories', () => {
            const sut = new DirectoryNode('.');
            sut.addFile('file1', defaultFileData);
            const folder = sut.addEmptyDirectory('folder1');
            folder.addFile('file1', defaultFileData);
            folder.addFile('file2', defaultFileData);

            expect(sut.totalNumberOfFiles).toEqual(3);
            expect(sut.totalNumberOfDirectories).toEqual(1);

            sut.removeDirectory('folder1');

            expect(sut.totalNumberOfFiles).toEqual(1);
            expect(sut.totalNumberOfDirectories).toEqual(0);
        });

        test('removing nested directory updates number of files and directories in root', () => {
            const sut = new DirectoryNode('.');
            sut.addFile('file1', defaultFileData);
            const folder = sut.addEmptyDirectory('folder1');
            folder.addFile('file1', defaultFileData);
            folder.addFile('file2', defaultFileData);
            const nested = folder.addEmptyDirectory('nested');
            nested.addFile('file1', defaultFileData);
            nested.addFile('file2', defaultFileData);

            expect(sut.totalNumberOfFiles).toEqual(5);
            expect(sut.totalNumberOfDirectories).toEqual(2);

            folder.removeDirectory('nested');

            expect(sut.totalNumberOfFiles).toEqual(3);
            expect(sut.totalNumberOfDirectories).toEqual(1);
        })

    });


    describe('removeFile()', () => {

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

        test('removing file updates total number of files in node', () => {
            const sut = new DirectoryNode('.');
            sut.addFile('file1', defaultFileData);
            sut.addFile('file2', defaultFileData);

            expect(sut.totalNumberOfFiles).toEqual(2);
            sut.removeFile('file1');
            expect(sut.totalNumberOfFiles).toEqual(1);
        });

        test('removing file non existing files does not update total number of files in node', () => {
            const sut = new DirectoryNode('.');
            sut.addFile('file1', defaultFileData);
            sut.addFile('file2', defaultFileData);

            expect(sut.totalNumberOfFiles).toEqual(2);
            sut.removeFile('nonExisting');
            expect(sut.totalNumberOfFiles).toEqual(2);
        });

        test('removing nested file update total number of files in root node', () => {
            const sut = new DirectoryNode('.');
            const nested = sut.addEmptyDirectory('nested');
            nested.addFile('file1', defaultFileData);
            nested.addFile('file2', defaultFileData);

            expect(sut.totalNumberOfFiles).toEqual(2);
            nested.removeFile('file1');
            expect(sut.totalNumberOfFiles).toEqual(1);
        });


    })
});
