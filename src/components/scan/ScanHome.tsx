import {observer} from "mobx-react"
import {useStyles} from "../../styles"
import {Paper, Typography} from "@material-ui/core"
import {ScanFolderButton} from "../support/buttons"
import * as React from "react"

export const ScanHome = observer(function ScanHome(): JSX.Element {
    const classes = useStyles({})
    return (
        <Paper className={classes.dialog}>
            <Typography variant="body1" component="p" gutterBottom>
                Select the folder to scan.
            </Typography>
            <ScanFolderButton />
        </Paper>
    )
})
