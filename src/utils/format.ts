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
