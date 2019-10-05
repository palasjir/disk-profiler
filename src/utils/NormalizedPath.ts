import * as PATH from "path"
import * as util from "lodash"
import {normalizedPathArray} from "./path"

export class NormalizedPath {
    private readonly _value: string[]

    public constructor(path?: string | null) {
        this._value = path ? normalizedPathArray(path) : []
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
        return new NormalizedPath(this._value.concat(other._value).join("/"))
    }

    public slice(start: number, end?: number): NormalizedPath {
        return new NormalizedPath(this._value.slice(start, end).join("/"))
    }

    public removeRoot(root: NormalizedPath): NormalizedPath {
        if (this.startsWith(root)) {
            const temp = this._value.slice(root.length)
            return new NormalizedPath(temp.join("/"))
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
