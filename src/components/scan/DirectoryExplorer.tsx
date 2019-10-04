import * as React from "react"
import {Grid, Paper, Typography} from "@material-ui/core"
import {useStyles} from "../../styles"
import {AppStoreContext} from "../../store/AppStoreContext"

export function DirectoryExplorer(): JSX.Element {
    const classes = useStyles({})
    const appStore = React.useContext(AppStoreContext)

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
                    <Typography variant="h5">Directory Explorer</Typography>
                </Paper>
            </Grid>
        </Grid>
    )
}
