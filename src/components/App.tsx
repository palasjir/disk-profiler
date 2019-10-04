import {observer} from "mobx-react"
import * as React from "react"

import {AppStoreContext} from "../store/AppStoreContext"
import {ScanState} from "../commons/types"
import styled from "styled-components"
import {ScanProgress} from "./scan/ScanProgress"
import {ScanHome} from "./scan/ScanHome"
import {ScanResults} from "./scan/ScanResults"
import {CssBaseline} from "@material-ui/core"

const StyledAppContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background: rgba(0, 0, 0, 0.8);
`

function getPage(scanState: ScanState): JSX.Element {
    switch (scanState) {
        case ScanState.NOT_STARTED:
            return <ScanHome />
        case ScanState.CANCEL_IN_PROGRESS:
        case ScanState.SCAN_IN_PROGRESS:
            return <ScanProgress />
        case ScanState.FINISHED:
            return <ScanResults />
    }
}

export const App = observer(function App(): JSX.Element {
    const mainStore = React.useContext(AppStoreContext)
    return (
        <>
            <CssBaseline />
            <StyledAppContainer>
                {getPage(mainStore.scanState)}
            </StyledAppContainer>
        </>
    )
})
