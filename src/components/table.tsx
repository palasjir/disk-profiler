import {Table, TableBody, TableCell, TableHead, TableRow} from '@material-ui/core';
import * as React from 'react';
import {FsNode} from '../commons/types';


interface FsNodeTableProps {
    nodes: FsNode[];
}

export function FsNodeTable(props: FsNodeTableProps) {
    return <Table size="small">
        <TableHead>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Last modified</TableCell>
                <TableCell>Path</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {props.nodes.map(node => (
                <TableRow key={node.path}>
                    <TableCell component="th" scope="row">{node.name}</TableCell>
                    <TableCell>{node.size}</TableCell>
                    <TableCell>{node.lastModified}</TableCell>
                    <TableCell>{node.path}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}