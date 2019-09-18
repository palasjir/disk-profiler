import * as FS from "fs";

export function getStats(path: string): FS.Stats | null {
    let stats = null;
    try {
        stats = FS.statSync(path);
    } catch (e) {
        console.error(`Can't read stats for ${path}.`);
    }
    return stats;
}