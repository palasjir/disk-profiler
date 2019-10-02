/**
 * Normalizes windows style paths by replacing double backslashes with single forward slashes (unix style).
 */
export function normalizePath(path: string): string {
    return path.replace(/\\/g, "/")
}

export function removeRootPath(rootPath: string, path: string): string {
    return path.trim().slice(rootPath.length)
}

export function normalizeRoot(path: string) {
    return path.endsWith("/") ? path : `${path}/`
}

export function concatPath(rootPath: string, path: string): string {
    return normalizeRoot(rootPath).concat(path)
}

export function fragmentizePath(rootPath: string, path: string): string[] {
    const normalizedPath = normalizePath(path)
    const pathWithoutRoot = removeRootPath(rootPath, normalizedPath)
    return pathWithoutRoot.split("/")
}
