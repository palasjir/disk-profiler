import {FileInfo} from '../commons/types';

export default class FileNode {
    name: string;
    data: FileInfo;

    public constructor(name: string, data: FileInfo) {
        this.name = name;
        this.data = data;
    }
}