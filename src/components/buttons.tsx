import * as React from 'react';

import {MainStoreContext} from '../store/context';
import {Button} from '@material-ui/core';
import {FolderOpenOutlined} from '@material-ui/icons';
import {useStyles} from '../styles';

export function ScanFolderButton(): JSX.Element {
    const mainStore = React.useContext(MainStoreContext);
    const styles = useStyles({});
    return (
        <Button variant="contained" onClick={() => mainStore.startDirectoryScan()}>
            <FolderOpenOutlined className={styles.buttonLeftIcon} />
            Scan folder
        </Button>
    )
}

export function CancelScanButton(): JSX.Element {
    const mainStore = React.useContext(MainStoreContext);
    const styles = useStyles({});
    return (
        <Button variant="contained" onClick={() => mainStore.cancelDirectoryScan()}>
            Cancel scan
        </Button>
    )
}