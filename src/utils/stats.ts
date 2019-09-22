import * as FS from "fs";
import {FileInfo} from '../commons/types';
import {normalizePath} from './path';

export function statsToFileData(originalPath: string, stats: FS.Stats): FileInfo {
    return {
        size: stats.size,
        lastModified: stats.mtimeMs,
        lastModifiedFormated: stats.mtime,
        originalPath,
        normalizedPath: normalizePath(originalPath)
    }
}