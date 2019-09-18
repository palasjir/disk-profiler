import {Table, TableBody, TableCell, TableHead, TableRow} from '@material-ui/core';
import * as React from 'react';
import {FileInfo} from '../../commons/types';
import {formatSize} from '../../utils/format';
import * as moment from 'moment';


interface FsNodeTableProps {
    readonly infos?: FileInfo[];
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
                    <TableRow key={info.path}>
                        <TableCell component="th" scope="row">{info.path}</TableCell>
                        <TableCell>{formatSize(info.size)}</TableCell>
                        <TableCell>{moment(info.lastModified).startOf('hour').fromNow()}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}