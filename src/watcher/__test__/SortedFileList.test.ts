import {SortedFileList} from "../SortedFileList"
import {FileInfo} from "../../commons/types"
import {normalizePath} from "../../utils/path"

const path = (p: string) => normalizePath(p).value

describe("SortedFileList", () => {
    test("asArray()", () => {
        const initial: FileInfo[] = [
            {
                rawNormalizedAbsolutePath: path("/b"),
                size: 4,
                lastModified: 0,
            },
            {
                rawNormalizedAbsolutePath: path("/a"),
                size: 1,
                lastModified: 0,
            },
        ]
        const list = new SortedFileList(initial)
        expect(list.asArray()).toEqual(initial)
    })

    test("adding in the middle of sorted list maintains the order", () => {
        const initial: FileInfo[] = [
            {
                rawNormalizedAbsolutePath: path("/b"),
                size: 4,
                lastModified: 0,
            },
            {
                rawNormalizedAbsolutePath: path("/a"),
                size: 1,
                lastModified: 0,
            },
        ]
        const list = new SortedFileList(initial)
        list.add({
            size: 2,
            rawNormalizedAbsolutePath: path("/c"),
            lastModified: 0,
        })

        const expected: FileInfo[] = [
            {
                rawNormalizedAbsolutePath: path("/b"),
                size: 4,
                lastModified: 0,
            },
            {
                size: 2,
                rawNormalizedAbsolutePath: path("/c"),
                lastModified: 0,
            },
            {
                rawNormalizedAbsolutePath: path("/a"),
                size: 1,
                lastModified: 0,
            },
        ]

        expect(list.asArray()).toEqual(expected)
    })

    test("adding largest", () => {
        const initial: FileInfo[] = [
            {
                rawNormalizedAbsolutePath: path("/b"),
                size: 4,
                lastModified: 0,
            },
            {
                rawNormalizedAbsolutePath: path("/a"),
                size: 1,
                lastModified: 0,
            },
        ]
        const list = new SortedFileList(initial)
        list.add({
            size: 5,
            rawNormalizedAbsolutePath: path("/c"),
            lastModified: 0,
        })

        const expected: FileInfo[] = [
            {
                size: 5,
                rawNormalizedAbsolutePath: path("/c"),
                lastModified: 0,
            },
            {
                rawNormalizedAbsolutePath: path("/b"),
                size: 4,
                lastModified: 0,
            },
            {
                rawNormalizedAbsolutePath: path("/a"),
                size: 1,
                lastModified: 0,
            },
        ]

        expect(list.asArray()).toEqual(expected)
    })

    test("adding smallest", () => {
        const initial: FileInfo[] = [
            {
                rawNormalizedAbsolutePath: path("/b"),
                size: 4,
                lastModified: 0,
            },
            {
                rawNormalizedAbsolutePath: path("/a"),
                size: 1,
                lastModified: 0,
            },
        ]
        const list = new SortedFileList(initial)
        list.add({
            size: 0,
            rawNormalizedAbsolutePath: path("/c"),
            lastModified: 0,
        })

        const expected: FileInfo[] = [
            {
                rawNormalizedAbsolutePath: path("/b"),
                size: 4,
                lastModified: 0,
            },
            {
                rawNormalizedAbsolutePath: path("/a"),
                size: 1,
                lastModified: 0,
            },
            {
                size: 0,
                rawNormalizedAbsolutePath: path("/c"),
                lastModified: 0,
            },
        ]

        expect(list.asArray()).toEqual(expected)
    })

    test("remove", () => {
        const initial: FileInfo[] = [
            {
                rawNormalizedAbsolutePath: path("/b"),
                size: 4,
                lastModified: 0,
            },
            {
                rawNormalizedAbsolutePath: path("/a"),
                size: 1,
                lastModified: 0,
            },
        ]
        const list = new SortedFileList(initial)
        list.remove({
            size: 0,
            rawNormalizedAbsolutePath: path("/b"),
            lastModified: 0,
        })

        const expected: FileInfo[] = [
            {
                rawNormalizedAbsolutePath: path("/a"),
                size: 1,
                lastModified: 0,
            },
        ]

        expect(list.asArray()).toEqual(expected)
    })

    test("update", () => {
        const initial: FileInfo[] = [
            {
                rawNormalizedAbsolutePath: path("/b"),
                size: 4,
                lastModified: 0,
            },
            {
                rawNormalizedAbsolutePath: path("/a"),
                size: 1,
                lastModified: 0,
            },
        ]
        const list = new SortedFileList(initial)
        list.update({
            size: 10,
            rawNormalizedAbsolutePath: path("/a"),
            lastModified: 0,
        })

        const expected: FileInfo[] = [
            {
                rawNormalizedAbsolutePath: path("/a"),
                size: 10,
                lastModified: 0,
            },
            {
                rawNormalizedAbsolutePath: path("/b"),
                size: 4,
                lastModified: 0,
            },
        ]

        expect(list.asArray()).toEqual(expected)
    })
})
