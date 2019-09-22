import {Table, TableBody, TableCell, TableHead, TableRow} from '@material-ui/core';
import * as React from 'react';
import {FileInfo} from '../../commons/types';
import {formatSize} from '../../utils/format';
import * as moment from 'moment';
import * as PATH from 'path';
import {OpenInFileExplorerButton} from './buttons';


interface FsNodeTableProps {
    readonly rootPath: string;
    readonly infos?: FileInfo[];
}

function relativePath(rootPath: string, path: string) {
    return `...${PATH.sep}${PATH.relative(rootPath, path)}`;
}

export function FsNodeTable(props: FsNodeTableProps): JSX.Element | null {
    if(!props.infos) {
        return null;
    }
    return (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Path</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Last modified</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.infos.map(info => (
                    <TableRow key={info.normalizedPath}>
                        <TableCell component="th" scope="row">{relativePath(props.rootPath, info.originalPath)}</TableCell>
                        <TableCell>{formatSize(info.size)}</TableCell>
                        <TableCell>{moment(info.lastModified).startOf('hour').fromNow()}</TableCell>
                        <TableCell><OpenInFileExplorerButton fullPath={info.originalPath} /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}