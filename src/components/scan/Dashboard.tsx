import * as React from "react"
import {Button, Grid, Paper, Typography} from "@material-ui/core"
import {ScanResultsStats} from "../support/ScanResultStats"
import {FsNodeTable} from "../support/FsTable"
import {useAppStore} from "../../store/AppStoreContext"
import {useStyles} from "../../styles"
import {observer} from "mobx-react"
import {ResultDisplay} from "../../store/AppStore"

export const Dashboard = observer(function Dashboard(): JSX.Element {
    const mainStore = useAppStore()
    const classes = useStyles({})

    return (
        <Grid
            container
            spacing={2}
            direction="column"
            justify="flex-start"
            alignItems="stretch"
            className={classes.contentGrid}
        >
            <Grid item>
                <Paper className={classes.paperContent}>
                    <Typography variant="h5" gutterBottom>
                        Scan finished. Watching for changes ...
                    </Typography>
                    <Typography>
                        {mainStore.selectedDirectory.asAbsolutePlatformSpecificPath()}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item>
                <Paper className={classes.paperContent}>
                    <ScanResultsStats
                        sizeInBytes={mainStore.totalSize || 0}
                        numberOfFiles={mainStore.numberOfFiles}
                        numberOfFolders={mainStore.numberOfFolders}
                    />
                </Paper>
            </Grid>
            <Grid item style={{height: "100%", overflow: "hidden"}}>
                <Paper
                    className={classes.paperContent}
                    style={{height: "100%", overflow: "hidden"}}
                >
                    <Grid
                        container
                        direction="column"
                        justify="flex-start"
                        alignItems="stretch"
                        wrap="nowrap"
                        style={{height: "100%"}}
                    >
                        <Grid item>
                            <div>
                                <Typography variant="h5" gutterBottom>
                                    10 Largest Files
                                </Typography>
                            </div>
                        </Grid>
                        <Grid item style={{overflow: "scroll"}}>
                            <FsNodeTable
                                rootPath={mainStore.selectedDirectory}
                                infos={mainStore.top10Files}
                            />
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
                                Show files
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )
})
