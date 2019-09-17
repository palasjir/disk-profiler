import {FileData} from './types';

export default class FileNode {
    name: string;
    data: FileData;

    public constructor(name: string, data: FileData) {
        this.name = name;
        this.data = data;
    }
}