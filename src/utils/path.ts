import {NormalizedPath} from "./NormalizedPath"

export const DELIMITER = "/"

/**
 * Normalizes windows style paths by replacing double backslashes with single forward slashes (unix style).
 */
export function normalizePath(path?: string | null): NormalizedPath {
    if (!path || path.length < 1) {
        return new NormalizedPath()
    }
    const arr = path
        .trim()
        .replace(/\\/g, DELIMITER)
        .split(DELIMITER)
        .filter(it => it.length > 0)

    return new NormalizedPath(arr)
}
