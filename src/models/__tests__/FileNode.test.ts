import DirectoryNode from '../DirectoryNode';

describe('FileNode', () => {

    test('updating file node size updates parent', () => {

        const dirNode = new DirectoryNode('.');
        const sut = dirNode.addFile('name', { originalPath: './name', normalizedPath: './name', size: 20, lastModified: 0});
        expect(dirNode.sizeInBytes).toEqual(20);

        sut.info = {originalPath: './name', normalizedPath: './name', size: 30, lastModified: 1};

        expect(dirNode.sizeInBytes).toEqual(30);
    })

});