import * as React from "react"
import {Grid, Paper, Typography} from "@material-ui/core"
import {useStyles} from "../../styles"
import {useAppStore} from "../../store/AppStoreContext"
import {DirList} from "../directory-list/DirList"
import {DirectoryNavigation} from "../directory-navigation/DirectoryNavigation"
import {observer} from "mobx-react"

export const DirectoryExplorer = observer(
    function DirectoryExplorer(): JSX.Element {
        const classes = useStyles({})
        const appStore = useAppStore()
        const dirExplorerStore = appStore.dirExplorerStore

        return (
            <Grid
                container
                spacing={2}
                direction="column"
                justify="flex-start"
                alignItems="stretch"
                wrap="nowrap"
                style={{height: "100%", overflow: "hidden"}}
            >
                <Grid item>
                    <Paper className={classes.paperContent}>
                        <Typography variant="h5">
                            Explore Directories
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item>
                    <Paper className={classes.paperContent}>
                        <DirectoryNavigation
                            rootPath={appStore.selectedDirectory}
                            absolutePath={
                                dirExplorerStore.currentPathRelativeToRoot
                            }
                        />
                    </Paper>
                </Grid>

                <Grid item style={{height: "100%", overflow: "hidden"}}>
                    <Paper
                        className={classes.paperContent}
                        style={{height: "100%", overflow: "scroll"}}
                    >
                        <DirList items={dirExplorerStore.items} />
                    </Paper>
                </Grid>
            </Grid>
        )
    }
)
