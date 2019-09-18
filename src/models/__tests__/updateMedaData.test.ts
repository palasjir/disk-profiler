import {
    DirInfoUpdater,
    updateDirInfo
} from '../DirInfoUpdater';
import {DirInfo} from '../../commons/types';

describe('updateMetaData', () => {

    test('no changes if updater is empty ', () => {
        const dirInfo: DirInfo = {
            totalNumberOfDirectories: 5,
            totalNumberOfFiles: 10,
            sizeInBytes: 1024
        };
        const result = updateDirInfo(dirInfo, {});
        expect(result).toEqual(dirInfo);
    });

    test('no changes if updater is not defined ', () => {
        const dirInfo: DirInfo = {
            totalNumberOfDirectories: 5,
            totalNumberOfFiles: 10,
            sizeInBytes: 1024
        };
        const result = updateDirInfo(dirInfo, undefined);
        expect(result).toEqual(dirInfo);
    });

    test('updates sizeInBytes', () => {
        const dirInfo: DirInfo = {
            totalNumberOfDirectories: 5,
            totalNumberOfFiles: 10,
            sizeInBytes: 1024
        };

        const updater: DirInfoUpdater = {
            sizeInBytes: current => current.sizeInBytes + 1024
        };

        const expected: DirInfo = {
            totalNumberOfDirectories: 5,
            totalNumberOfFiles: 10,
            sizeInBytes: 2048
        };

        const result = updateDirInfo(dirInfo, updater);

        expect(result).toEqual(expected);
    });

    test('updates sizeInBytes, totalNumberOfFiles, totalNumberOfDirectories', () => {
        const dirInfo: DirInfo = {
            totalNumberOfDirectories: 5,
            totalNumberOfFiles: 10,
            sizeInBytes: 1024
        };

        const updater: DirInfoUpdater = {
            totalNumberOfDirectories: current => 35,
            totalNumberOfFiles: current => 30,
            sizeInBytes: current => 2048,
        };

        const expected: DirInfo = {
            totalNumberOfDirectories: 35,
            totalNumberOfFiles: 30,
            sizeInBytes: 2048
        };

        const result = updateDirInfo(dirInfo, updater);

        expect(result).toEqual(expected);
    });

});