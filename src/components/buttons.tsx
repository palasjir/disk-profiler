import * as React from 'react';

import {MainStoreContext} from '../store/context';
import {Button} from '@material-ui/core';
import {FolderOpenOutlined} from '@material-ui/icons';
import {useStyles} from '../styles';

interface ScanFolderButtonProps {
    readonly title?: string;
}

export function ScanFolderButton(props: ScanFolderButtonProps): JSX.Element {
    const mainStore = React.useContext(MainStoreContext);
    const styles = useStyles({});
    return (
        <Button variant="contained" onClick={() => mainStore.startDirectoryScan()}>
            <FolderOpenOutlined className={styles.buttonLeftIcon} />
            {props.title || 'Scan folder'}
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