import * as React from "react"

import {AppStoreContext} from "../../store/AppStoreContext"
import {Button} from "@material-ui/core"
import {FolderOpenOutlined, GpsFixedOutlined} from "@material-ui/icons"
import {useStyles} from "../../styles"

interface ScanFolderButtonProps {
    readonly title?: string
}

export function ScanFolderButton(props: ScanFolderButtonProps): JSX.Element {
    const mainStore = React.useContext(AppStoreContext)
    const styles = useStyles({})
    return (
        <Button
            variant="contained"
            onClick={() => mainStore.startDirectoryScan()}
        >
            <FolderOpenOutlined className={styles.buttonLeftIcon} />
            {props.title || "Scan folder"}
        </Button>
    )
}

export function CancelScanButton(): JSX.Element {
    const mainStore = React.useContext(AppStoreContext)
    return (
        <Button
            variant="contained"
            onClick={() => mainStore.cancelDirectoryScan()}
        >
            Cancel scan
        </Button>
    )
}

export interface OpenInFileExplorerButtonProps {
    readonly fullPath: string
}

export function OpenInFileExplorerButton(
    props: OpenInFileExplorerButtonProps
): JSX.Element {
    const mainStore = React.useContext(AppStoreContext)
    return (
        <Button
            onClick={() => mainStore.revealInFileExplorer(props.fullPath)}
            title="Show in file explorer."
        >
            <GpsFixedOutlined />
        </Button>
    )
}

export function ShowMoreFilesButton(): JSX.Element {
    const mainStore = React.useContext(AppStoreContext)
    return (
        <Button onClick={() => mainStore.showMoreFiles()}>
            Show more files
        </Button>
    )
}
