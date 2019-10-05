import * as React from "react"

import {AppStoreContext, useAppStore} from "../../store/AppStoreContext"
import {Button, CircularProgress} from "@material-ui/core"
import {FolderOpenOutlined, GpsFixedOutlined} from "@material-ui/icons"
import {useStyles} from "../../styles"
import {GetMoreState} from "../../store/AppStore"
import {observer} from "mobx-react"

interface ScanFolderButtonProps {
    readonly title?: string
}

export function ScanFolderButton(props: ScanFolderButtonProps): JSX.Element {
    const mainStore = useAppStore()
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
    const mainStore = useAppStore()
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
    const mainStore = useAppStore()
    return (
        <Button
            onClick={() => mainStore.revealInFileExplorer(props.fullPath)}
            title="Show in file explorer."
        >
            <GpsFixedOutlined />
        </Button>
    )
}

export const ShowMoreFilesButton = observer(
    function ShowMoreFilesButton(): JSX.Element {
        const mainStore = useAppStore()
        const classes = useStyles({})

        return (
            <div className={classes.buttonProgressWrapper}>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={mainStore.showMoreState === GetMoreState.PENDING}
                    onClick={() => mainStore.showMoreFiles()}
                >
                    Show more
                </Button>
                {mainStore.showMoreState === GetMoreState.PENDING && (
                    <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                    />
                )}
            </div>
        )
    }
)
