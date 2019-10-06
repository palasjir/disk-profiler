import {normalizePath} from "../path"
import {NormalizedPath} from "../../models/NormalizedPath"

describe("normalizePath", () => {
    test("path undefined", () => {
        const result = normalizePath(undefined)
        expect(result).toEqual(new NormalizedPath())
    })

    test("path null", () => {
        const result = normalizePath(null)
        expect(result).toEqual(new NormalizedPath())
    })

    test("path empty string", () => {
        const result = normalizePath()
        expect(result).toEqual(new NormalizedPath())
    })

    test("root path POSIX", () => {
        const result = normalizePath("/")
        expect(result).toEqual(new NormalizedPath())
    })

    test("root path WINDOWS", () => {
        const result = normalizePath("C:")
        expect(result).toEqual(new NormalizedPath(["C:"]))
    })

    test("longer POSIX path", () => {
        const result = normalizePath("/root/path/to/file.txt")
        expect(result).toEqual(
            new NormalizedPath(["root", "path", "to", "file.txt"])
        )
    })

    test("longer WINDOWS path", () => {
        const result = normalizePath("C:\\path\\to\\file.txt")
        expect(result).toEqual(
            new NormalizedPath(["C:", "path", "to", "file.txt"])
        )
    })

    test("ignores trailing slash POSIX", () => {
        const result = normalizePath("/root/path/to/directory/")
        expect(result).toEqual(
            new NormalizedPath(["root", "path", "to", "directory"])
        )
    })

    test("ignores trailing slash WINDOWS", () => {
        const result = normalizePath("C:\\path\\to\\directory\\")
        expect(result).toEqual(
            new NormalizedPath(["C:", "path", "to", "directory"])
        )
    })
})
