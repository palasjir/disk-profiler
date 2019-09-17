import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import {observer} from 'mobx-react';

import {ScanState,} from './commons/types';
import {CancelScanButton, ScanFolderButton} from './components/buttons';
import {MainStore} from './store/mainStore';
import {MainStoreContext} from './store/context';
import {ScanResultsStats} from './components/scan-result-stats';
import {
    Button,
    Grid,
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@material-ui/core';
import {useStyles} from './styles';
import {FsNodeTable} from './components/table';

const StyledAppContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: rgba(0,0, 0 , 0.8);
`;

const StyledPage = styled.div`
  height: 100%;
  width: 100%;
  background: whitesmoke;
  padding: 20px;
`;

const ScanHome = observer(function ScanHome(): JSX.Element {
    const classes = useStyles({});
    return (
        <Paper className={classes.dialog}>
            <Typography variant="body1" component="p" gutterBottom>
                Select the folder to scan.
            </Typography>
            <ScanFolderButton />
        </Paper>
    )
});

const ScanProgress = observer(function ScanProgress(): JSX.Element {
    const mainStore = React.useContext(MainStoreContext);
    const classes = useStyles({});

    return (
        <StyledPage>
            <Paper className={classes.content}>
                <Grid container spacing={2} direction="column" justify="flex-start" alignItems="stretch">
                    <Grid item>
                        <div>
                            <Typography variant="h5" gutterBottom>
                                {mainStore.inProgressMsg}
                            </Typography>
                            <Typography gutterBottom>
                                {mainStore.selectedDirectory}
                            </Typography>
                            <LinearProgress />
                        </div>
                    </Grid>
                    {mainStore.scanState === ScanState.SCAN_IN_PROGRESS &&
                        <Grid item>
                            <CancelScanButton />
                        </Grid>
                    }
                </Grid>
            </Paper>
        </StyledPage>
    )
});

const ScanResults = observer(function ScanResult(): JSX.Element {
    const mainStore = React.useContext(MainStoreContext);
    const classes = useStyles({});
    return (
        <StyledPage>
            <Grid container spacing={2} direction="column" justify="flex-start" alignItems="stretch">
                <Grid item>
                    <Paper className={classes.content}>
                        <Typography gutterBottom>
                            {mainStore.selectedDirectory}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.content}>
                        <Typography gutterBottom>
                            {mainStore.selectedDirectory}
                        </Typography>
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
                                        10 largest files
                                    </Typography>
                                    {/*<FsNodeTable nodes={mainStore.topFiles} />*/}
                                </div>
                            </Grid>
                            <Grid item>
                                <Button>Show all files</Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.content}>
                        <Grid container direction="column" justify="flex-start" alignItems="stretch">
                            <Grid item>
                                <Typography variant="h5" gutterBottom>
                                    10 largest folders
                                </Typography>
                                {/*<FsNodeTable nodes={mainStore.topFolders} />*/}
                            </Grid>
                            <Grid item>
                                <Button>Show all folders</Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </StyledPage>
    );
});

const App = observer(function App(): JSX.Element {
    const mainStore = React.useContext(MainStoreContext);
    return (
        <StyledAppContainer>
            {mainStore.scanState === ScanState.NOT_STARTED && <ScanHome />}
            {Boolean(
                mainStore.scanState === ScanState.SCAN_IN_PROGRESS
                || mainStore.scanState === ScanState.CANCEL_IN_PROGRESS)
            && <ScanProgress />}
            {mainStore.scanState === ScanState.FINISHED && <ScanResults />}
        </StyledAppContainer>
    )
});

const store = new MainStore();
ReactDOM.render(
    <MainStoreContext.Provider value={store}>
        <App />
    </MainStoreContext.Provider>,
    document.getElementById("app")
);