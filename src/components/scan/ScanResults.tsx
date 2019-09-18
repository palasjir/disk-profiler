import {observer} from 'mobx-react';
import * as React from 'react';
import {AppStoreContext} from '../../store/AppStoreContext';
import {useStyles} from '../../styles';
import {Button, Grid, Paper, Typography} from '@material-ui/core';
import {ScanFolderButton} from '../support/buttons';
import {ScanResultsStats} from '../support/ScanResultStats';
import { Page } from '../page';
import {FsNodeTable} from '../support/FsTable';

export const ScanResults = observer(function ScanResult(): JSX.Element {
    const mainStore = React.useContext(AppStoreContext);
    const classes = useStyles({});
    return (
        <Page>
            <Grid container spacing={2} direction="column" justify="flex-start" alignItems="stretch">
                <Grid item>
                    <Paper className={classes.content}>
                        <Typography variant="h5" gutterBottom>
                            Scan finished. Watching for changes ...
                        </Typography>
                        <Typography gutterBottom>
                            {mainStore.selectedDirectory}
                        </Typography>
                        <ScanFolderButton title="Scan new directory"/>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.content}>
                        <ScanResultsStats
                            sizeInBytes={mainStore.totalSize}
                            numberOfFiles={mainStore.numberOfFiles}
                            numberOfFolders={mainStore.numberOfFolders}
                        />
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.content}>
                        <Grid container direction="column" justify="flex-start" alignItems="stretch">
                            <Grid item>
                                <div>
                                    <Typography variant="h5" gutterBottom>
                                        Largest Files
                                    </Typography>
                                    <FsNodeTable infos={mainStore.topFiles} />
                                </div>
                            </Grid>
                            <Grid item>
                                {/* Todo: Load add ability to browse more than 100 files. */}
                                <Button onClick={() => window.alert("Sorry! Lazy programmer haven't provided this yet.")}>Show more files</Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Page>
    );
});