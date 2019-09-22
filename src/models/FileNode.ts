import {FileInfo} from '../commons/types';
import DirectoryNode from './DirectoryNode';
import {updateDirInfoUp} from './DirInfoUpdater';

export default class FileNode {

    private _name: string;
    private _parent: DirectoryNode;
    private _info: FileInfo;

    public constructor(name: string, info: FileInfo, parent?: DirectoryNode) {
        this._name = name;
        this._info = info;
        this._parent = parent;
    }

    get name() :string {
        return this._name;
    }

    set info(info: FileInfo) {
        const oldSize = this._info.size;
        this._info = info;
        const diff = this._info.size - oldSize;
        updateDirInfoUp(this._parent, {
            sizeInBytes: current => current.sizeInBytes + diff
        })
    }

    get info(): FileInfo {
        return this._info;
    }

    get parent(): DirectoryNode {
        return this._parent;
    }
}