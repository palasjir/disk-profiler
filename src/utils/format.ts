const UNITS = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

export function formatSize(size: number): string {
    if (size < 1) {
        const numberString = size.toString(10)
        return numberString + " " + UNITS[0]
    }
    const exponent = Math.min(
        Math.floor(Math.log10(size) / 3),
        UNITS.length - 1
    )
    size = Number((size / Math.pow(1000, exponent)).toPrecision(3))
    const numberString = size.toString(10)
    const unit = UNITS[exponent]
    return numberString + " " + unit
}

export function formatItems(count?: number): string {
    if (!count) return ""
    return count === 1 ? `1 item` : `${count} items`
}

export function formatNumberOfFiles(count?: number): string {
    if (!count) return "0 files"
    return count === 1 ? `1 file` : `${count} files`
}

export function formatNumberOfDirs(count?: number): string {
    if (!count) return "0 folders"
    return count === 1 ? `1 folder` : `${count} folders`
}
