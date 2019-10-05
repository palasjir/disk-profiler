import * as PATH from "path"
import {NormalizedPath} from "./NormalizedPath"

export const DELIMITER = "/"

/**
 * Normalizes windows style paths by replacing double backslashes with single forward slashes (unix style).
 */
export function normalizePath(path: string): string {
    return path.trim().replace(/\\/g, DELIMITER)
}

export function normalizedPathArray(path: string): string[] {
    return normalizePath(path)
        .split(DELIMITER)
        .filter(it => it.length > 0)
}

export function removeRootPath(rootPath: string, path: string): string {
    const temp = path.trim().slice(rootPath.length)
    return temp.startsWith("/") ? temp.slice(1) : temp
}

export function normalizeRoot(path: string) {
    return path.endsWith("/") ? path : `${path}/`
}

export function concatPath(rootPath: string, path: string): string {
    return normalizeRoot(rootPath).concat(path)
}

export function toNormalizedPath(arr: string[]): NormalizedPath {
    return new NormalizedPath(arr.join(DELIMITER))
}

/**
 * @param rootPath - root path
 * @param path - path
 * @return
 *      undefined when given path is from different root
 *      empty array when given path is equal root path
 *      path fragments with removed root
 */
export function fragmentizePath(
    rootPath: string,
    path: string
): string[] | undefined {
    const normalizedRoot = PATH.resolve(normalizeRoot(rootPath))
    const normalizedPath = PATH.resolve(normalizePath(path))

    if (!normalizedPath.startsWith(normalizedRoot)) {
        return undefined
    }

    const pathWithoutRoot = removeRootPath(normalizedRoot, normalizedPath)
    return pathWithoutRoot.length > 1 ? pathWithoutRoot.split("/") : []
}
