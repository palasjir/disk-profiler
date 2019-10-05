import * as React from "react"
import {Grid, Paper, Typography} from "@material-ui/core"
import {FsNodeTable} from "../support/FsTable"
import {ShowMoreFilesButton} from "../support/buttons"
import {useAppStore} from "../../store/AppStoreContext"
import {useStyles} from "../../styles"

export function LargestFiles(): JSX.Element {
    const appStore = useAppStore()
    const classes = useStyles({})

    return (
        <Grid
            container
            spacing={2}
            direction="column"
            justify="flex-start"
            alignItems="stretch"
        >
            <Grid item>
                <Paper className={classes.paperContent}>
                    <Typography variant="h5" gutterBottom>
                        Largest Files
                    </Typography>
                </Paper>
            </Grid>

            <Grid item>
                <Paper className={classes.paperContent}>
                    <FsNodeTable
                        rootPath={appStore.selectedDirectory}
                        infos={appStore.topFiles}
                    />
                </Paper>
            </Grid>

            <Grid item>
                <Paper className={classes.paperContent}>
                    <div style={{display: "flex"}}>
                        <ShowMoreFilesButton />
                    </div>
                </Paper>
            </Grid>
        </Grid>
    )
}
