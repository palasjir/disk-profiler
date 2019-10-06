import * as PATH from "path"
import * as util from "lodash"

export class NormalizedPath {
    private readonly _value: string[]

    public constructor(path: string[] = []) {
        this._value = path
    }

    get value(): string[] {
        return this._value.slice(0)
    }

    get isEmpty(): boolean {
        return this._value.length < 1
    }

    get length(): number {
        return this._value.length
    }

    public startsWith(other: NormalizedPath): boolean {
        const thisValue = this._value
        const otherValue = other._value
        if (this._value.length < otherValue.length) {
            return false
        }

        for (let i = 0; i < otherValue.length; i++) {
            if (thisValue[i] !== otherValue[i]) {
                return false
            }
        }

        return true
    }

    public join(other: NormalizedPath): NormalizedPath {
        return new NormalizedPath(this._value.concat(other._value))
    }

    public slice(start: number, end?: number): NormalizedPath {
        return new NormalizedPath(this._value.slice(start, end))
    }

    public removeRoot(root: NormalizedPath): NormalizedPath {
        if (this.startsWith(root)) {
            return new NormalizedPath(this._value.slice(root.length))
        }
        return this
    }

    public asAbsolutePlatformSpecificPath(): string {
        const temp = this._value.join(PATH.sep)
        return PATH.sep === "/" ? `/${temp}` : temp
    }

    public asRelativePlatformSpecificPath(): string {
        return this._value.join(PATH.sep)
    }

    public isEqual(other: NormalizedPath): boolean {
        return util.isEqual(this._value, other._value)
    }
}
