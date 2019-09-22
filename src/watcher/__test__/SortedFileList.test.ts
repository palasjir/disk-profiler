import {SortedFileList} from '../SortedFileList';
import {FileInfo} from '../../commons/types';

describe('SortedFileList', () => {

    test('asArray()', () => {
        const initial: FileInfo[] = [
            {
                normalizedPath: '/b',
                originalPath: '/b',
                size: 4,
                lastModified: 0
            },
            {
                normalizedPath: '/a',
                originalPath: '/a',
                size: 1,
                lastModified: 0
            },
        ];
        const list = new SortedFileList(initial);
        expect(list.asArray()).toEqual(initial);
    });


    test('adding in the middle of sorted list maintains the order', () => {
        const initial: FileInfo[] = [
            {
                normalizedPath: '/b',
                originalPath: '/b',
                size: 4,
                lastModified: 0
            },
            {
                normalizedPath: '/a',
                originalPath: '/a',
                size: 1,
                lastModified: 0
            },
        ];
        const list = new SortedFileList(initial);
        list.add({
            size: 2,
            normalizedPath: '/c',
            originalPath: '/c',
            lastModified: 0
        });

        const expected: FileInfo[] = [
            {
                normalizedPath: '/b',
                originalPath: '/b',
                size: 4,
                lastModified: 0
            },
            {
                size: 2,
                normalizedPath: '/c',
                originalPath: '/c',
                lastModified: 0
            },
            {
                normalizedPath: '/a',
                originalPath: '/a',
                size: 1,
                lastModified: 0
            },
        ];

        expect(list.asArray()).toEqual(expected);
    });

    test('adding largest', () => {
        const initial: FileInfo[] = [
            {
                normalizedPath: '/b',
                originalPath: '/b',
                size: 4,
                lastModified: 0
            },
            {
                normalizedPath: '/a',
                originalPath: '/a',
                size: 1,
                lastModified: 0
            },
        ];
        const list = new SortedFileList(initial);
        list.add({
            size: 5,
            normalizedPath: '/c',
            originalPath: '/c',
            lastModified: 0
        });

        const expected: FileInfo[] = [
            {
                size: 5,
                normalizedPath: '/c',
                originalPath: '/c',
                lastModified: 0
            },
            {
                normalizedPath: '/b',
                originalPath: '/b',
                size: 4,
                lastModified: 0
            },
            {
                normalizedPath: '/a',
                originalPath: '/a',
                size: 1,
                lastModified: 0
            },
        ];

        expect(list.asArray()).toEqual(expected);
    });

    test('adding smallest', () => {
        const initial: FileInfo[] = [
            {
                normalizedPath: '/b',
                originalPath: '/b',
                size: 4,
                lastModified: 0
            },
            {
                normalizedPath: '/a',
                originalPath: '/a',
                size: 1,
                lastModified: 0
            },
        ];
        const list = new SortedFileList(initial);
        list.add({
            size: 0,
            normalizedPath: '/c',
            originalPath: '/c',
            lastModified: 0
        });

        const expected: FileInfo[] = [
            {
                normalizedPath: '/b',
                originalPath: '/b',
                size: 4,
                lastModified: 0
            },
            {
                normalizedPath: '/a',
                originalPath: '/a',
                size: 1,
                lastModified: 0
            },
            {
                size: 0,
                normalizedPath: '/c',
                originalPath: '/c',
                lastModified: 0
            },
        ];

        expect(list.asArray()).toEqual(expected);
    });

    test('remove', () => {
        const initial: FileInfo[] = [
            {
                normalizedPath: '/b',
                originalPath: '/b',
                size: 4,
                lastModified: 0
            },
            {
                normalizedPath: '/a',
                originalPath: '/a',
                size: 1,
                lastModified: 0
            },
        ];
        const list = new SortedFileList(initial);
        list.remove({
            size: 0,
            normalizedPath: '/b',
            originalPath: '/a',
            lastModified: 0
        });

        const expected: FileInfo[] = [
            {
                normalizedPath: '/a',
                originalPath: '/a',
                size: 1,
                lastModified: 0
            }
        ];

        expect(list.asArray()).toEqual(expected);
    });

    test('update', () => {
        const initial: FileInfo[] = [
            {
                normalizedPath: '/b',
                originalPath: '/b',
                size: 4,
                lastModified: 0
            },
            {
                normalizedPath: '/a',
                originalPath: '/a',
                size: 1,
                lastModified: 0
            },
        ];
        const list = new SortedFileList(initial);
        list.update({
            size: 10,
            normalizedPath: '/a',
            originalPath: '/a',
            lastModified: 0
        });

        const expected: FileInfo[] = [
            {
                normalizedPath: '/a',
                originalPath: '/a',
                size: 10,
                lastModified: 0
            },
            {
                normalizedPath: '/b',
                originalPath: '/b',
                size: 4,
                lastModified: 0
            },
        ];

        expect(list.asArray()).toEqual(expected);
    });


});