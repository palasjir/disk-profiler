import * as React from "react"
import {Button, Grid, Paper, Typography} from "@material-ui/core"
import {ScanResultsStats} from "../support/ScanResultStats"
import {FsNodeTable} from "../support/FsTable"
import {AppStoreContext} from "../../store/AppStoreContext"
import {useStyles} from "../../styles"
import {observer} from "mobx-react"
import {ResultDisplay} from "../../store/AppStore"

export const Dashboard = observer(function Dashboard(): JSX.Element {
    const mainStore = React.useContext(AppStoreContext)
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
                        Scan finished. Watching for changes ...
                    </Typography>
                    <Typography gutterBottom>
                        {mainStore.selectedDirectory}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item>
                <Paper className={classes.paperContent}>
                    <ScanResultsStats
                        sizeInBytes={mainStore.totalSize}
                        numberOfFiles={mainStore.numberOfFiles}
                        numberOfFolders={mainStore.numberOfFolders}
                    />
                </Paper>
            </Grid>
            <Grid item>
                <Paper className={classes.paperContent}>
                    <Grid
                        container
                        direction="column"
                        justify="flex-start"
                        alignItems="stretch"
                    >
                        <Grid item>
                            <div>
                                <Typography variant="h5" gutterBottom>
                                    10 Largest Files
                                </Typography>
                                <FsNodeTable
                                    rootPath={mainStore.selectedDirectory}
                                    infos={mainStore.top10Files}
                                />
                            </div>
                        </Grid>
                        <Grid item className={classes.moreButton}>
                            <Button
                                variant="contained"
                                onClick={() =>
                                    mainStore.setResultDisplay(
                                        ResultDisplay.FILES
                                    )
                                }
                            >
                                Show more files
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )
})
