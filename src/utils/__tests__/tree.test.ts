import DirectoryTree from '../../models/DirectoryTree';
import {
    extractFileListFromNode,
    extractFileListFromTree
} from '../tree';
import {FileInfo} from '../../commons/types';
import DirectoryNode from '../../models/DirectoryNode';

const rootPath = '/root/path';
const defaultFileData: FileInfo = { size: 500, lastModified: 0};
const path = (p: string) => rootPath + p;

describe('extractFileListFromTree()', () => {

    test('gets empty list for empty tree', () => {
        const tree = new DirectoryTree(rootPath);
        const result = extractFileListFromTree(tree);
        expect(result).toEqual([]);
    });

    test('gets list of all files contained in the tree', () => {
        const tree = new DirectoryTree(rootPath);
        tree.addFile(path('/file1.txt'), defaultFileData);
        tree.addFile(path('/file2.txt'), defaultFileData);
        tree.addFile(path('/dir1/file3.txt'), defaultFileData);
        tree.addFile(path('/dir1/file4.txt'), defaultFileData);
        tree.addFile(path('/dir2/file5.txt'), defaultFileData);
        tree.addFile(path('/dir2/file6.txt'), defaultFileData);
        tree.addFile(path('/dir1/nested1/file7.txt'), defaultFileData);
        tree.addFile(path('/dir1/nested1/file8.txt'), defaultFileData);

        expect(tree.head.totalNumberOfFiles).toEqual(8);

        const result = extractFileListFromTree(tree);

        expect(result).toHaveLength(8);
        expect(result).toContain(path('/file1.txt'));
        expect(result).toContain(path('/file2.txt'));
        expect(result).toContain(path('/dir1/file3.txt'));
        expect(result).toContain(path('/dir1/file4.txt'));
        expect(result).toContain(path('/dir2/file5.txt'));
        expect(result).toContain(path('/dir2/file6.txt'));
        expect(result).toContain(path('/dir1/nested1/file7.txt'));
        expect(result).toContain(path('/dir1/nested1/file8.txt'));
    });

});

describe('extractFileListFromNode()', () => {

    test('gets empty list for empty node', () => {
        const node = new DirectoryNode('.');
        const result = extractFileListFromNode(node, rootPath);
        expect(result).toEqual([]);
    });

    test('gets list of all files contained in the node', () => {
        const tree = new DirectoryTree(rootPath);
        tree.addFile(path('/file1.txt'), defaultFileData);
        tree.addFile(path('/file2.txt'), defaultFileData);
        tree.addFile(path('/dir1/file3.txt'), defaultFileData);
        tree.addFile(path('/dir1/file4.txt'), defaultFileData);
        tree.addFile(path('/dir2/file5.txt'), defaultFileData);
        tree.addFile(path('/dir2/file6.txt'), defaultFileData);
        tree.addFile(path('/dir1/nested1/file7.txt'), defaultFileData);
        tree.addFile(path('/dir1/nested1/file8.txt'), defaultFileData);

        expect(tree.head.totalNumberOfFiles).toEqual(8);

        const result = extractFileListFromNode(tree.head, rootPath);

        expect(result).toHaveLength(8);
        expect(result).toContain(path('/file1.txt'));
        expect(result).toContain(path('/file2.txt'));
        expect(result).toContain(path('/dir1/file3.txt'));
        expect(result).toContain(path('/dir1/file4.txt'));
        expect(result).toContain(path('/dir2/file5.txt'));
        expect(result).toContain(path('/dir2/file6.txt'));
        expect(result).toContain(path('/dir1/nested1/file7.txt'));
        expect(result).toContain(path('/dir1/nested1/file8.txt'));
    });

});