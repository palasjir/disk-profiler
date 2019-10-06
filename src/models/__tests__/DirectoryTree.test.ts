import DirectoryTree from "../DirectoryTree"
import {FileInfo} from "../../commons/types"
import DirectoryNode from "../DirectoryNode"
import FileNode from "../FileNode"
import {NormalizedPath} from "../../utils/NormalizedPath"
import {normalizePath} from "../../utils/path"

const rootPath = new NormalizedPath(["root", "path"])
const defaultFileData = {size: 500, lastModified: 0}

const path = (p: string) => rootPath.join(normalizePath(p))

const fileData = (p: string): FileInfo => ({
    ...defaultFileData,
    rawNormalizedAbsolutePath: path(p).value,
})

describe("DirectoryTree", () => {
    describe("constructor", () => {
        test("creates root path with ending slash", () => {
            let sut = new DirectoryTree(rootPath)
            expect(sut.rootPath).toEqual(rootPath)
        })
    })

    describe("addDirectory", () => {
        test("adds directory", () => {
            const sut = new DirectoryTree(rootPath)

            const folder1Path = rootPath.join(new NormalizedPath(["folder1"]))
            sut.addEmptyDirectory(folder1Path)
            expect(sut.head.getNumberOfDirectories()).toEqual(1)

            const folder2Path = rootPath.join(new NormalizedPath(["folder2"]))
            sut.addEmptyDirectory(folder2Path)
            expect(sut.head.getNumberOfDirectories()).toEqual(2)
        })

        test(`can't add the same directory twice`, () => {
            const sut = new DirectoryTree(rootPath)

            const folder1Path = rootPath.join(new NormalizedPath(["folder1"]))
            sut.addEmptyDirectory(folder1Path)
            expect(sut.head.getNumberOfDirectories()).toEqual(1)

            sut.addEmptyDirectory(folder1Path)
            expect(sut.head.getNumberOfDirectories()).toEqual(1)
        })

        test(`adds directory with complex path`, () => {
            const sut = new DirectoryTree(rootPath)

            const folder1Path = rootPath.join(
                new NormalizedPath(["folder1", "folder1"])
            )
            sut.addEmptyDirectory(folder1Path)
            expect(sut.head.getNumberOfDirectories()).toEqual(1)
            expect(
                (sut.head.getDirectory(
                    "folder1"
                ) as DirectoryNode).getNumberOfDirectories()
            ).toEqual(1)
        })
    })

    describe("addFile()", () => {
        test("adding file to nested directory that does't exist increases total number of directories and files", () => {
            let sut = new DirectoryTree(rootPath)
            expect(sut.head.totalNumberOfFiles).toEqual(0)
            expect(sut.head.totalNumberOfDirectories).toEqual(0)

            const filePath = rootPath.join(
                new NormalizedPath(["folder1", "folder1"])
            )
            sut.addFile(filePath, fileData("/nested1/file.txt"))

            expect(sut.head.totalNumberOfFiles).toEqual(1)
            expect(sut.head.totalNumberOfDirectories).toEqual(1)
        })

        test("adding file to nested directory that exists increases total number of directories and files", () => {
            let sut = new DirectoryTree(rootPath)
            sut.addEmptyDirectory(path("/dir1"))

            expect(sut.head.totalNumberOfFiles).toEqual(0)
            expect(sut.head.totalNumberOfDirectories).toEqual(1)

            sut.addFile(
                path("/dir1/nested1/file.txt"),
                fileData("/dir/nested1/file.txt")
            )

            expect(sut.head.totalNumberOfFiles).toEqual(1)
            expect(sut.head.totalNumberOfDirectories).toEqual(2)
        })
    })

    describe("removeDirectory", () => {
        test("removes directory from structure", () => {
            const sut = new DirectoryTree(rootPath)

            sut.addFile(
                path("/folder1/file1.txt"),
                fileData("/folder1/file1.txt")
            )
            expect(sut.head.getNumberOfDirectories()).toEqual(1)

            sut.removeDirectory(path("folder1"))
            expect(sut.head.getNumberOfDirectories()).toEqual(0)
        })

        test("removing directory updates size", () => {
            const sut = new DirectoryTree(rootPath)

            sut.addFile(
                path("/folder1/file1.txt"),
                fileData("/folder1/file1.txt")
            )
            expect(sut.head.sizeInBytes).toEqual(500)

            sut.removeDirectory(path("folder1"))
            expect(sut.head.sizeInBytes).toEqual(0)
        })
    })

    describe("findDirectory", () => {
        test("gives root", () => {
            const sut = new DirectoryTree(rootPath)
            const found = sut.findDirectory(rootPath)
            expect(found).toBe(sut.head)
        })

        test("gives undefined when searching for directory with different root", () => {
            const falseRoot = new NormalizedPath(["false", "root"])
            const sut = new DirectoryTree(rootPath)
            const found = sut.findDirectory(falseRoot)
            expect(found).toBeUndefined()
        })

        test("gives correct directory when directory exists", () => {
            const sut = new DirectoryTree(rootPath)
            const folder = sut.addEmptyDirectory(path("/folder"))
            const found = sut.findDirectory(path("/folder"))
            expect(found).toBe(folder)
        })

        test("gives null when directory doesn't exist", () => {
            const sut = new DirectoryTree(rootPath)
            const folder = sut.addEmptyDirectory(path("/folder"))
            const found = sut.findDirectory(path(`/nonExisting`))
            expect(found).toBeUndefined()
            expect(sut.head.getDirectory("folder")).toBe(folder)
        })
    })

    describe("findFile()", () => {
        test("gives correct file when file exists", () => {
            const sut = new DirectoryTree(rootPath)
            const folder = sut.addEmptyDirectory(
                path(`/folder`)
            ) as DirectoryNode
            const file = folder.addFile(
                "file.txt",
                fileData("/file.txt")
            ) as FileNode
            const found = sut.findFile(path(`/folder/file.txt`))
            expect(found).toBe(file)
        })

        test("gives null when directory doesn't exist", () => {
            const sut = new DirectoryTree(rootPath)
            sut.addEmptyDirectory(path(`/folder`))
            const found = sut.findFile(path(`/folder/nonExisting.txt`))
            expect(found).toBeUndefined()
        })
    })

    describe("removeDirectory", () => {
        test("removes directory from structure", () => {
            const sut = new DirectoryTree(rootPath)
            const folder = sut.addEmptyDirectory(
                path(`/folder`)
            ) as DirectoryNode
            const nested1 = folder.addEmptyDirectory("nested1")
            const nested2 = folder.addEmptyDirectory("nested2")
            const removed = sut.removeDirectory(path(`/folder/nested1`))

            expect(removed).toBe(nested1)
            expect(folder.getDirectory("nested2")).toBe(nested2)
        })

        test("doesnt cause any side effect when file does not exist", () => {
            const sut = new DirectoryTree(rootPath)
            const folder = sut.addEmptyDirectory(
                path(`/folder`)
            ) as DirectoryNode
            const nested1 = folder.addEmptyDirectory("nested1")
            const nested2 = folder.addEmptyDirectory("nested2")
            const removed = sut.removeDirectory(path(`/folder/nested3`))

            expect(removed).toBeUndefined()
            expect(folder.getDirectory("nested1")).toBe(nested1)
            expect(folder.getDirectory("nested2")).toBe(nested2)
        })
    })

    describe("removeFile", () => {
        test("removes correct file from root", () => {
            const sut = new DirectoryTree(rootPath)

            sut.addFile(path("file1.txt"), fileData("/file1.txt"))
            sut.addFile(path("file2.txt"), fileData("/file2.txt"))
            expect(sut.head.getNumberOfFiles()).toEqual(2)

            sut.removeFile(path("file1.txt"))
            expect(sut.head.getNumberOfFiles()).toEqual(1)
            expect(sut.head.getFile(`file1.txt`)).not.toBeDefined()
            expect(sut.head.getFile(`file2.txt`)).toBeDefined()
        })

        test("removes file from structure", () => {
            const sut = new DirectoryTree(rootPath)
            const folder = sut.addEmptyDirectory(
                path(`/folder`)
            ) as DirectoryNode
            const file1 = folder.addFile("file1.txt", fileData("/file.txt"))
            const file2 = folder.addFile("file2.txt", fileData("/file.txt"))
            const removed = sut.removeFile(path(`/folder/file1.txt`))

            expect(removed).toBe(file1)
            expect(folder.getFile("file1.txt")).toBeUndefined()
            expect(folder.getFile("file2.txt")).toBe(file2)
        })

        test("doesnt cause any side effect when file does not exist", () => {
            const sut = new DirectoryTree(rootPath)
            const folder = sut.addEmptyDirectory(
                path(`/folder`)
            ) as DirectoryNode
            const file1 = folder.addFile("file1.txt", fileData("/file1.txt"))
            const file2 = folder.addFile("file2.txt", fileData("/file2.txt"))
            const removed = sut.removeFile(path(`/folder/doesNotExist.txt`))

            expect(removed).toBeUndefined()
            expect(folder.getFile("file1.txt")).toBe(file1)
            expect(folder.getFile("file2.txt")).toBe(file2)
        })
    })
})
