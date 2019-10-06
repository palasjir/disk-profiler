import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@material-ui/core"
import * as React from "react"
import {FileInfo} from "../../commons/types"
import {formatSize} from "../../utils/format"
import * as moment from "moment"
import {OpenInFileExplorerButton} from "./buttons"
import {NormalizedPath} from "../../models/NormalizedPath"

interface FsNodeTableProps {
    readonly rootPath: NormalizedPath
    readonly infos?: FileInfo[]
}

function relativePath(rootPath: NormalizedPath, path: NormalizedPath) {
    return path.removeRoot(rootPath).asRelativePlatformSpecificPath()
}

export function FsNodeTable(props: FsNodeTableProps): JSX.Element | null {
    if (!props.infos) {
        return null
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
                {props.infos.map(info => {
                    const normalizedPath = new NormalizedPath(
                        info.rawNormalizedAbsolutePath
                    )
                    const path = normalizedPath.asAbsolutePlatformSpecificPath()
                    return (
                        <TableRow key={path}>
                            <TableCell component="th" scope="row">
                                {relativePath(props.rootPath, normalizedPath)}
                            </TableCell>
                            <TableCell>{formatSize(info.size)}</TableCell>
                            <TableCell>
                                {moment(info.lastModified)
                                    .startOf("hour")
                                    .fromNow()}
                            </TableCell>
                            <TableCell>
                                <OpenInFileExplorerButton fullPath={path} />
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
