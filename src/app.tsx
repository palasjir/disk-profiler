import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import {observer} from 'mobx-react';

import {ScanState,} from './commons/types';
import {ScanFolderButton} from './components/buttons';
import {MainStore} from './store/mainStore';
import {MainStoreContext} from './store/context';

const StyledAppContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: rgba(0,0, 0 , 0.8);
`;

const StyledModal = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: whitesmoke;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 5px 5px 10px -2px rgba(0,0,0,0.75);
`;

const ScanHome = observer(function ScanHome(): JSX.Element {
    const mainStore = React.useContext(MainStoreContext);
    return (
        <StyledModal>
            <p>Select the folder to scan.</p>
            {mainStore.scanState !== ScanState.IN_PROGRESS && <ScanFolderButton />}
        </StyledModal>
    )
});

const ScanProgress = observer(function ScanProgress(): JSX.Element {
    const mainStore = React.useContext(MainStoreContext);
    return (
        <div>
            {mainStore.scanState === ScanState.IN_PROGRESS && <h2>Scan in progress ...</h2>}
        </div>
    )
});

const ScanResults = observer(function ScanResult(): JSX.Element {
    const mainStore = React.useContext(MainStoreContext);
    return (
        <div>
            <h2>Scan finished.</h2>
            {mainStore.totalSize && <h2>Total size: {mainStore.totalSize} bytes</h2>}
        </div>
    );
});

const App = observer(function App(): JSX.Element {
    const mainStore = React.useContext(MainStoreContext);
    return (
        <StyledAppContainer>
            {mainStore.scanState === ScanState.NOT_STARTED && <ScanHome />}
            {mainStore.scanState === ScanState.IN_PROGRESS && <ScanProgress />}
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