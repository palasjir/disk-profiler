import {FsNode, NodeType} from './types';

export class DirectoryTree {

    private numberOfFiles = 0;
    private numberOfFolders = 0;
    private size = 0;
    private topFiles: [];
    private topFolders: [];

    public addNode(node: FsNode) {
        if(node.type == NodeType.FILE) {
            this.numberOfFiles += 1;
        } else if(node.type === NodeType.FOLDER) {
            this.numberOfFolders += 1;
        }
    }



}