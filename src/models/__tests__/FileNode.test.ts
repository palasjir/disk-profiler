import DirectoryNode from "../DirectoryNode"
import FileNode from "../FileNode"
import {NormalizedPath} from "../../models/NormalizedPath"

describe("FileNode", () => {
    test("updating file node size updates parent", () => {
        const dirNode = new DirectoryNode(".")
        const sut = dirNode.addFile("name", {
            rawNormalizedAbsolutePath: ["name"],
            size: 20,
            lastModified: 0,
        }) as FileNode
        expect(dirNode.sizeInBytes).toEqual(20)

        sut.info = {
            rawNormalizedAbsolutePath: ["name"],
            size: 30,
            lastModified: 1,
        }

        expect(dirNode.sizeInBytes).toEqual(30)
    })
})
