import * as FS from "fs";
import * as UTIL from 'util';

const stat = UTIL.promisify(FS.stat);

export function getStats(path: string, stats?: FS.Stats): Promise<FS.Stats | null> {
    if(stats) return Promise.resolve(stats);
    return stat(path);
}