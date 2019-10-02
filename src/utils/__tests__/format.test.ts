import {formatSize} from "../format"

describe("formatSize", () => {
    test("formats kB", () => {
        let result = formatSize(1000)
        expect(result).toEqual("1 kB")

        result = formatSize(999_999)
        expect(result).toEqual("1000 kB")
    })

    test("formats MB", () => {
        const result = formatSize(1_000_000)
        expect(result).toEqual("1 MB")
    })

    test("formats GB", () => {
        const result = formatSize(1_000_000_000)
        expect(result).toEqual("1 GB")
    })
})
