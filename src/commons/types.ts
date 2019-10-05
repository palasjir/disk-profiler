export enum ToScannerMessageType {
    START = "START",
    SHOW_MORE = "SHOW_MORE",
    CANCEL = "CANCEL",
    GET_DIRECTORY_EXPLORER_DATA = "GET_DIRECTORY_EXPLORER_DATA",
}

export enum ToAppMessageType {
    STARTED = "STARTED",
    FINISHED = "FINISHED",
    CANCEL_IN_PROGRESS = "CANCEL_IN_PROGRESS",
    UPDATED = "UPDATED",
    READY = "READY",
    ERROR = "ERROR",
    DIR_EXPLORER_DATA = "DIR_EXPLORER_DATA",
}

export enum ScanState {
    NOT_STARTED = "NOT_STARTED",
    SCAN_IN_PROGRESS = "SCAN_IN_PROGRESS",
    CANCEL_IN_PROGRESS = "CANCEL_IN_PROGRESS",
    FINISHED = "FINISHED",
}

export enum DirListItemType {
    FOLDER,
    FILE,
}

export type RawNormalizedPath = string[]

export interface ToScannerMessage {
    readonly type: ToScannerMessageType
    readonly data?: ScanStartEventData | GetDirectoryExplorerData
}

export interface ToAppMessage {
    readonly type: ToAppMessageType
    readonly requestType?: ToScannerMessageType
    readonly data?: ScanStartEventData | ScanResultData | DirectoryExplorerData
}

export interface ScanStartEventData {
    readonly rawNormalizedRootPath: RawNormalizedPath
}

export interface GetDirectoryExplorerData {
    readonly rawNormalizedAbsolutePath: RawNormalizedPath
}

export interface ScanResultData {
    readonly tree: NodeStats
}

export interface DirListItemModel {
    readonly type: DirListItemType
    readonly name: string
    readonly size: number
    readonly itemCount?: number
}

export interface DirectoryExplorerData {
    readonly rawNormalizedAbsolutePath: RawNormalizedPath
    readonly items: DirListItemModel[]
}

export interface SecondaryStats {
    numberOfFiles: number
    numberOfFolders: number
}

export interface NodeStats extends SecondaryStats {
    size: number
    topFiles?: FileInfo[]
}

export interface FileInfo {
    size: number
    lastModified: number
    lastModifiedFormatted?: Date
    rawNormalizedAbsolutePath: RawNormalizedPath
}

export interface DirInfo {
    totalNumberOfDirectories: number
    totalNumberOfFiles: number
    sizeInBytes: number
}
