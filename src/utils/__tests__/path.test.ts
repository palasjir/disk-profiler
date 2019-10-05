import {fragmentizePath} from "../path"

describe("fragmentizePath", () => {
    test("should give empty array when root is same as path", () => {
        const result = fragmentizePath("/root/path", "/root/path")
        expect(result).toEqual([])
    })

    test("should give empty array when root (ends with slash) is same as path", () => {
        const result = fragmentizePath("/root/path/", "/root/path")
        expect(result).toEqual([])
    })
    test("should give empty array when root is same as path (ends with slash)", () => {
        const result = fragmentizePath("/root/path", "/root/path/")
        expect(result).toEqual([])
    })

    test("should give undefined when path doesn't have the same root", () => {
        const result = fragmentizePath("/root/path", "/falseroot/path")
        expect(result).toBeUndefined()
    })

    test("should give fragmentized path without root", () => {
        const result = fragmentizePath(
            "/root/path/",
            "/root/path/folder1/folder2/file.txt"
        )
        expect(result).toEqual(["folder1", "folder2", "file.txt"])
    })

    test("should give fragmentized path without root (root without / at the end)", () => {
        const result = fragmentizePath(
            "/root/path",
            "/root/path/folder1/folder2/file.txt"
        )
        expect(result).toEqual(["folder1", "folder2", "file.txt"])
    })
})
