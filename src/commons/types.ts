export interface IDirectoryTree {
    readonly totalSize: number;
}

export interface ScanMessage {
    readonly state: ScanState;
    readonly payload?: IDirectoryTree;
}

export enum ScanState {
    NOT_STARTED, IN_PROGRESS, FINISHED
}

export enum ScannedObjectType {
    file, directory
}

export interface ScannedObject {
    type: ScannedObjectType;
    path: string;
    size: number;
}