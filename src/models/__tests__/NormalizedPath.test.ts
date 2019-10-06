import {NormalizedPath} from "../NormalizedPath"

describe("NormalizedPath", () => {
    test("is immutable", () => {
        const sut = new NormalizedPath(["root", "path"])
        expect(sut.value[0]).toEqual("root")
        sut.value[0] = ""
        expect(sut.value[0]).toEqual("root")
    })

    describe("isEmpty", () => {
        test("empty path", () => {
            const sut = new NormalizedPath()
            expect(sut.isEmpty).toBeTruthy()
        })

        test("not empty path", () => {
            const sut = new NormalizedPath(["folder"])
            expect(sut.isEmpty).toBeFalsy()
        })
    })

    describe("startsWith", () => {
        test("both empty", () => {
            const sut = new NormalizedPath()
            const other = new NormalizedPath()
            const result = sut.startsWith(other)
            expect(result).toBeTruthy()
        })

        test("empty", () => {
            const sut = new NormalizedPath()
            const other = new NormalizedPath(["root", "path"])
            const result = sut.startsWith(other)
            expect(result).toBeFalsy()
        })

        test("query empty", () => {
            const sut = new NormalizedPath(["/root", "path"])
            const other = new NormalizedPath()
            const result = sut.startsWith(other)
            expect(result).toBeTruthy()
        })

        test("both equal", () => {
            const sut = new NormalizedPath(["root", "path"])
            const other = new NormalizedPath(["root", "path"])
            const result = sut.startsWith(other)
            expect(result).toBeTruthy()
        })

        test("starts with", () => {
            const sut = new NormalizedPath(["root", "path", "to", "directory"])
            const other = new NormalizedPath(["root", "path"])
            const result = sut.startsWith(other)
            expect(result).toBeTruthy()
        })

        test("DOES NOT start with", () => {
            const sut = new NormalizedPath(["root", "to", "directory"])
            const other = new NormalizedPath(["root", "path"])
            const result = sut.startsWith(other)
            expect(result).toBeFalsy()
        })
    })

    describe("join", () => {
        test("both empty", () => {
            const sut = new NormalizedPath()
            const other = new NormalizedPath()
            const result = sut.join(other)
            expect(result).toEqual(new NormalizedPath())
        })

        test("first empty", () => {
            const sut = new NormalizedPath()
            const other = new NormalizedPath(["root", "path"])
            const result = sut.join(other)
            expect(result).toEqual(new NormalizedPath(["root", "path"]))
        })

        test("second empty", () => {
            const sut = new NormalizedPath(["root", "path"])
            const other = new NormalizedPath()
            const result = sut.join(other)
            expect(result).toEqual(new NormalizedPath(["root", "path"]))
        })

        test("joined", () => {
            const sut = new NormalizedPath(["root", "path"])
            const other = new NormalizedPath(["to", "directory"])
            const result = sut.join(other)
            expect(result).toEqual(
                new NormalizedPath(["root", "path", "to", "directory"])
            )
        })
    })

    describe("slice", () => {
        test("empty", () => {
            const sut = new NormalizedPath()
            const result = sut.slice(2, 10)
            expect(result).toEqual(new NormalizedPath())
        })

        test("from start", () => {
            const sut = new NormalizedPath(["root", "path"])
            const result = sut.slice(0)
            expect(result).toEqual(new NormalizedPath(["root", "path"]))
        })

        test("from index", () => {
            const sut = new NormalizedPath(["root", "path"])
            const result = sut.slice(1)
            expect(result).toEqual(new NormalizedPath(["path"]))
        })

        test("to index", () => {
            const sut = new NormalizedPath(["root", "path"])
            const result = sut.slice(0, 1)
            expect(result).toEqual(new NormalizedPath(["root"]))
        })

        test("from index to index", () => {
            const sut = new NormalizedPath(["root", "path", "to", "folder"])
            const result = sut.slice(1, 3)
            expect(result).toEqual(new NormalizedPath(["path", "to"]))
        })
    })

    describe("removeRoot", () => {
        test("both empty", () => {
            const sut = new NormalizedPath()
            const root = new NormalizedPath()
            const result = sut.removeRoot(root)
            expect(result).toEqual(new NormalizedPath())
        })

        test("false root", () => {
            const sut = new NormalizedPath(["root", "path"])
            const root = new NormalizedPath(["false", "path"])
            const result = sut.removeRoot(root)
            expect(result).toEqual(new NormalizedPath(["root", "path"]))
        })

        test("equal paths", () => {
            const sut = new NormalizedPath(["root", "path"])
            const root = new NormalizedPath(["root", "path"])
            const result = sut.removeRoot(root)
            expect(result).toEqual(new NormalizedPath())
        })

        test("removes root", () => {
            const sut = new NormalizedPath(["root", "path", "to", "file"])
            const root = new NormalizedPath(["root", "path"])
            const result = sut.removeRoot(root)
            expect(result).toEqual(new NormalizedPath(["to", "file"]))
        })
    })
})
