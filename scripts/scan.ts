import * as FS from 'fs';
import * as PATH from 'path';
import {scanDirectoryTree} from '../src/commons/scannerUtils';
import DirectoryTree from '../src/commons/DirectoryTree';

const pathToScan1 = "/Users/jirpal/Downloads/skolka-praminek";
const pathToScan2 = "/Users/jirpal/dev/skolka-praminek";

const pathToScan = pathToScan2;

const tree = new DirectoryTree(pathToScan);
scanDirectoryTree(pathToScan, tree);
console.dir(tree);