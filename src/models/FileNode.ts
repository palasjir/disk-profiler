import {FileInfo} from '../commons/types';

export default class FileNode {
    name: string;
    info: FileInfo;

    public constructor(name: string, data: FileInfo) {
        this.name = name;
        this.info = data;
    }
}