import {FileInfo} from "../commons/types"
import * as util from "lodash"
import {NormalizedPath} from "../models/NormalizedPath"

export class SortedFileList {
    private list: FileInfo[]
    private map: Map<string, number> = new Map()
    private compare: util.ValueIteratee<FileInfo>

    public constructor(list: FileInfo[] = [], sorted = false) {
        this.compare = (o): number => -o.size
        this.list = sorted ? list : util.sortBy(list, this.compare)
        this.list.forEach((it, i) =>
            this.map.set(
                new NormalizedPath(
                    it.rawNormalizedAbsolutePath
                ).asAbsolutePlatformSpecificPath(),
                i
            )
        )
    }

    private findIndex(file: FileInfo): number {
        return util.sortedIndexBy(this.list, file, this.compare)
    }

    public add(file: FileInfo): void {
        if (
            this.map.has(
                new NormalizedPath(
                    file.rawNormalizedAbsolutePath
                ).asAbsolutePlatformSpecificPath()
            )
        ) {
            return
        }
        const index = this.findIndex(file)
        this.list.splice(index, 0, file)
        this.map.set(
            new NormalizedPath(
                file.rawNormalizedAbsolutePath
            ).asAbsolutePlatformSpecificPath(),
            index
        )

        // update indexes of the files that got moved
        for (let i = index + 1; i < this.list.length; i++) {
            this.map.set(
                new NormalizedPath(
                    this.list[i].rawNormalizedAbsolutePath
                ).asAbsolutePlatformSpecificPath(),
                i
            )
        }
    }

    public remove(fileInfo: FileInfo): void {
        const index = this.map.get(
            new NormalizedPath(
                fileInfo.rawNormalizedAbsolutePath
            ).asAbsolutePlatformSpecificPath()
        )

        if (index === undefined) {
            return
        }

        if (
            this.map.delete(
                new NormalizedPath(
                    fileInfo.rawNormalizedAbsolutePath
                ).asAbsolutePlatformSpecificPath()
            )
        ) {
            this.list.splice(index, 1)
        }

        // update indexes of the files that got moved
        for (let i = index; i < this.list.length; i++) {
            this.map.set(
                new NormalizedPath(
                    this.list[i].rawNormalizedAbsolutePath
                ).asAbsolutePlatformSpecificPath(),
                i
            )
        }
    }

    public update(fileInfo: FileInfo): void {
        this.remove(fileInfo)
        this.add(fileInfo)
    }

    public getRange(limit: number): FileInfo[] {
        return util.take(this.asArray(), limit)
    }

    public asArray(): FileInfo[] {
        return this.list
    }
}
