import * as React from "react";
import * as ReactDOM from "react-dom";
import {ipcRenderer, OpenDialogReturnValue, remote, IpcRendererEvent} from 'electron';

import {EVENT_MSG_SCAN, EVENT_START_SCAN} from './commons/constants';
import {ScanMessage, ScanState, } from './commons/types';

async function selectDirectory(): Promise<OpenDialogReturnValue> {
    return remote.dialog.showOpenDialog({ properties: ['openDirectory'] })
}

function startScanDirectory(folder: OpenDialogReturnValue) {
    if(folder.filePaths.length <= 0) {
        return;
    }
    const selectedDirectory = folder.filePaths[0];
    console.log(`Selected directory: ${selectedDirectory}`);
    ipcRenderer.send(EVENT_START_SCAN, selectedDirectory);
}

function App(): JSX.Element {

    const [scanState, setScanState] = React.useState(ScanState.NOT_STARTED);
    const [totalSize, setTotalSize] = React.useState();

    async function onClick() {
        const selectedDirectory = await selectDirectory();
        startScanDirectory(selectedDirectory);
    }

    React.useEffect(() => {

        function handleScanMsg(event: IpcRendererEvent, result: ScanMessage): void {
            setScanState(result.state);
            const payload = result.payload;
            if(payload) {
                setTotalSize(payload.totalSize);
            }
        }

       ipcRenderer.on(EVENT_MSG_SCAN, handleScanMsg);
    }, []);

    return (
        <div>
            <h1>Disk analyser</h1>
            {scanState !== ScanState.IN_PROGRESS && <button onClick={onClick}>Scan directory</button>}
            {scanState === ScanState.IN_PROGRESS && <h2>Scan in progress ...</h2>}
            {scanState === ScanState.FINISHED && <h2>Scan finished.</h2>}
            {totalSize && <h2>Total size: {totalSize}</h2>}
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById("app")
);