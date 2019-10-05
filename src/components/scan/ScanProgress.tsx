import {observer} from "mobx-react"
import * as React from "react"
import {useAppStore} from "../../store/AppStoreContext"
import {useStyles} from "../../styles"
import {Page} from "../page"
import {Grid, LinearProgress, Paper, Typography} from "@material-ui/core"
import {ScanState} from "../../commons/types"
import {CancelScanButton} from "../support/buttons"

export const ScanProgress = observer(function ScanProgress(): JSX.Element {
    const mainStore = useAppStore()
    const classes = useStyles({})

    return (
        <Page>
            <Paper className={classes.paperContent}>
                <Grid
                    container
                    spacing={2}
                    direction="column"
                    justify="flex-start"
                    alignItems="stretch"
                >
                    <Grid item>
                        <div>
                            <Typography variant="h5" gutterBottom>
                                {mainStore.inProgressMsg}
                            </Typography>
                            <Typography gutterBottom>
                                {mainStore.selectedDirectory.asAbsolutePlatformSpecificPath()}
                            </Typography>
                            <LinearProgress />
                        </div>
                    </Grid>
                    {mainStore.scanState === ScanState.SCAN_IN_PROGRESS && (
                        <Grid item>
                            <CancelScanButton />
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Page>
    )
})
