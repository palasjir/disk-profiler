import {
    DirectoryNodeMeta,
    DirectoryNodeMetaUpdater,
    updateMetaData
} from '../metaDataUpdaters';

describe('updateMetaData', () => {

    test('no changes if updater is empty ', () => {
        const meta: DirectoryNodeMeta = {
            totalNumberOfDirectories: 5,
            totalNumberOfFiles: 10,
            sizeInBytes: 1024
        };
        const result = updateMetaData(meta, {});
        expect(result).toEqual(meta);
    });

    test('no changes if updater is not defined ', () => {
        const meta: DirectoryNodeMeta = {
            totalNumberOfDirectories: 5,
            totalNumberOfFiles: 10,
            sizeInBytes: 1024
        };
        const result = updateMetaData(meta, undefined);
        expect(result).toEqual(meta);
    });

    test('updates sizeInBytes', () => {
        const meta: DirectoryNodeMeta = {
            totalNumberOfDirectories: 5,
            totalNumberOfFiles: 10,
            sizeInBytes: 1024
        };

        const updater: DirectoryNodeMetaUpdater = {
            sizeInBytes: current => current.sizeInBytes + 1024
        };

        const expected: DirectoryNodeMeta = {
            totalNumberOfDirectories: 5,
            totalNumberOfFiles: 10,
            sizeInBytes: 2048
        };

        const result = updateMetaData(meta, updater);

        expect(result).toEqual(expected);
    });

    test('updates sizeInBytes, totalNumberOfFiles, totalNumberOfDirectories', () => {
        const meta: DirectoryNodeMeta = {
            totalNumberOfDirectories: 5,
            totalNumberOfFiles: 10,
            sizeInBytes: 1024
        };

        const updater: DirectoryNodeMetaUpdater = {
            totalNumberOfDirectories: current => 35,
            totalNumberOfFiles: current => 30,
            sizeInBytes: current => 2048,
        };

        const expected: DirectoryNodeMeta = {
            totalNumberOfDirectories: 35,
            totalNumberOfFiles: 30,
            sizeInBytes: 2048
        };

        const result = updateMetaData(meta, updater);

        expect(result).toEqual(expected);
    });

});