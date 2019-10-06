export default class DebugLogger {
    public debug: boolean
    public afterReady: boolean
    public isReady: boolean

    public canLog(): boolean {
        if (!this.debug) return false
        return !(this.afterReady && !this.isReady)
    }

    public log(value: string): void {
        if (!this.canLog()) return
        console.log(value)
    }
}
