import {Table, TableBody, TableCell, TableHead, TableRow} from '@material-ui/core';
import * as React from 'react';
import FileNode from '../../models/FileNode';


interface FsNodeTableProps {
    nodes: FileNode[];
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
                <TableRow key={node.data.path}>
                    <TableCell component="th" scope="row">{node.name}</TableCell>
                    <TableCell>{node.data.size}</TableCell>
                    <TableCell>{node.data.lastModified}</TableCell>
                    <TableCell>{node.data.path}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}