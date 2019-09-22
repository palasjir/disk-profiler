import {FileInfo} from '../commons/types';
import * as util from 'lodash'

export class SortedFileList {

    private list: FileInfo[];
    private map = new Map();
    private compare?: util.ValueIteratee<FileInfo>;

    public constructor(list: FileInfo[] = [], sorted: boolean = false) {
        this.compare = o => -o.size;
        this.list = sorted ? list : util.sortBy(list, this.compare);
        for (const i in this.list) {
            const item = list[i];
           this.map.set(item.normalizedPath, i);
        }
    }

    private findIndex(file: FileInfo): number {
        return util.sortedIndexBy(this.list, file, this.compare);
    }

    public add(file: FileInfo): void {
        if(this.map.has(file.normalizedPath)){
            return;
        }
        const index = this.findIndex(file);
        this.list.splice(index, 0, file);
        this.map.set(file.normalizedPath, index);
    }

    public remove(fileInfo: FileInfo): void {
        const index = this.map.get(fileInfo.normalizedPath);
        if(this.map.delete(fileInfo.normalizedPath)) {
            this.list.splice(index, 1);
        }
    }

    public update(fileInfo: FileInfo): void {
        this.remove(fileInfo);
        this.add(fileInfo);
    }

    public getRange(limit: number): FileInfo[] {
        return util.take(this.asArray(), limit);
    }

    public asArray(): FileInfo[] {
        return this.list;
    }

}