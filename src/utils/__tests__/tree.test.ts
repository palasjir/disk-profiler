import DirectoryTree from "../../models/DirectoryTree"
import {
    extractFileListFromNode,
    extractFileListFromTree,
    getTopFiles,
} from "../tree"
import {FileInfo} from "../../commons/types"
import DirectoryNode from "../../models/DirectoryNode"

const rootPath = "/root/path"
const fileData = (p: string): FileInfo => ({
    size: 500,
    lastModified: 0,
    originalPath: p,
    normalizedPath: p,
})
const path = (p: string) => rootPath + p

describe("extractFileListFromTree()", () => {
    test("gets empty list for empty tree", () => {
        const tree = new DirectoryTree(rootPath)
        const result = extractFileListFromTree(tree)
        expect(result).toEqual([])
    })

    test("gets list of all files contained in the tree", () => {
        const tree = new DirectoryTree(rootPath)
        tree.addFile(path("/file1.txt"), fileData("/file1.txt"))
        tree.addFile(path("/file2.txt"), fileData("/file2.txt"))
        tree.addFile(path("/dir1/file3.txt"), fileData("/dir1/file3.txt"))
        tree.addFile(path("/dir1/file4.txt"), fileData("/dir1/file4.txt"))
        tree.addFile(path("/dir2/file5.txt"), fileData("/dir2/file5.txt"))
        tree.addFile(path("/dir2/file6.txt"), fileData("/dir2/file6.txt"))
        tree.addFile(
            path("/dir1/nested1/file7.txt"),
            fileData("/dir1/nested1/file7.txt")
        )
        tree.addFile(
            path("/dir1/nested1/file8.txt"),
            fileData("/dir1/nested1/file8.txt")
        )

        expect(tree.head.totalNumberOfFiles).toEqual(8)

        const result = extractFileListFromTree(tree)

        expect(result).toHaveLength(8)
        expect(result).toContainEqual(fileData("/file1.txt"))
        expect(result).toContainEqual(fileData("/file2.txt"))
        expect(result).toContainEqual(fileData("/dir1/file3.txt"))
        expect(result).toContainEqual(fileData("/dir1/file4.txt"))
        expect(result).toContainEqual(fileData("/dir2/file5.txt"))
        expect(result).toContainEqual(fileData("/dir2/file6.txt"))
        expect(result).toContainEqual(fileData("/dir1/nested1/file7.txt"))
        expect(result).toContainEqual(fileData("/dir1/nested1/file8.txt"))
    })
})

describe("extractFileListFromNode()", () => {
    test("gets empty list for empty node", () => {
        const node = new DirectoryNode(".")
        const result = extractFileListFromNode(node, rootPath)
        expect(result).toEqual([])
    })

    test("gets list of all files contained in the node", () => {
        const tree = new DirectoryTree(rootPath)
        tree.addFile(path("/file1.txt"), fileData("/file1.txt"))
        tree.addFile(path("/file2.txt"), fileData("/file2.txt"))
        tree.addFile(path("/dir1/file3.txt"), fileData("/dir1/file3.txt"))
        tree.addFile(path("/dir1/file4.txt"), fileData("/dir1/file4.txt"))
        tree.addFile(path("/dir2/file5.txt"), fileData("/dir2/file5.txt"))
        tree.addFile(path("/dir2/file6.txt"), fileData("/dir2/file6.txt"))
        tree.addFile(
            path("/dir1/nested1/file7.txt"),
            fileData("/dir1/nested1/file7.txt")
        )
        tree.addFile(
            path("/dir1/nested1/file8.txt"),
            fileData("/dir1/nested1/file8.txt")
        )

        expect(tree.head.totalNumberOfFiles).toEqual(8)

        const result = extractFileListFromNode(tree.head, rootPath)

        expect(result).toHaveLength(8)
        expect(result).toContainEqual(fileData("/file1.txt"))
        expect(result).toContainEqual(fileData("/file2.txt"))
        expect(result).toContainEqual(fileData("/dir1/file3.txt"))
        expect(result).toContainEqual(fileData("/dir1/file4.txt"))
        expect(result).toContainEqual(fileData("/dir2/file5.txt"))
        expect(result).toContainEqual(fileData("/dir2/file6.txt"))
        expect(result).toContainEqual(fileData("/dir1/nested1/file7.txt"))
        expect(result).toContainEqual(fileData("/dir1/nested1/file8.txt"))
    })
})

describe("getTopFiles", () => {
    test("get top files", () => {
        const list: FileInfo[] = [
            {
                originalPath: "/a",
                normalizedPath: "/a",
                lastModified: 0,
                size: 10,
            },
            {
                originalPath: "/b",
                normalizedPath: "/b",
                lastModified: 0,
                size: 20,
            },
            {
                originalPath: "/c",
                normalizedPath: "/c",
                lastModified: 0,
                size: 30,
            },
            {
                originalPath: "/d",
                normalizedPath: "/d",
                lastModified: 0,
                size: 40,
            },
        ]

        const expected: FileInfo[] = [
            {
                originalPath: "/d",
                normalizedPath: "/d",
                lastModified: 0,
                size: 40,
            },
            {
                originalPath: "/c",
                normalizedPath: "/c",
                lastModified: 0,
                size: 30,
            },
            {
                originalPath: "/b",
                normalizedPath: "/b",
                lastModified: 0,
                size: 20,
            },
        ]

        const result = getTopFiles(list, 3)
        expect(result).toEqual(expected)
    })
})
