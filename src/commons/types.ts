export interface IDirectoryTree {
    readonly stats: NodeStats;
}

export enum ToScannerMessageType {
    START='START'
    , CANCEL = 'CANCEL'
}

export interface ToScannerMessage {
    readonly type: ToScannerMessageType;
    readonly data?: ScanStartEventData;
}

export enum ToAppMessageType {
    STARTED='STARTED'
    , FINISHED='FINISHED'
    , CANCEL_IN_PROGRESS='CANCEL_IN_PROGRESS'
    , UPDATED='UPDATED'
    , READY = 'READY'
    , ERROR='ERROR'
}

export interface ToAppMessage {
    readonly type: ToAppMessageType;
    readonly data?: ScanStartEventData | ScanResultData;
}

export interface ScanStartEventData {
    readonly path: string;
}

export interface ScanResultData {
    readonly tree: NodeStats;

}

export enum ScanState {
    NOT_STARTED
    , SCAN_IN_PROGRESS
    , CANCEL_IN_PROGRESS
    , FINISHED
}

export enum NodeType {
    FOLDER
    , FILE
    , UNKNOWN
}

export interface SecondaryStats {
    numberOfFiles: number;
    numberOfFolders: number;
}

export interface NodeStats extends SecondaryStats {
    size: number;
}

export interface FileData {
    size: number;
    lastModified: number;
    path?: number;
}