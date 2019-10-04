import {observer} from "mobx-react"
import * as React from "react"
import {AppStoreContext} from "../../store/AppStoreContext"
import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core"
import {Page} from "../page"
import {
    Dashboard as DashboardIcon,
    InsertDriveFile as FileIcon,
    Folder as FolderIcon,
} from "@material-ui/icons"
import {useStyles} from "../../styles"
import {ResultDisplay} from "../../store/AppStore"
import {ScanFolderButton} from "../support/buttons"
import {Dashboard} from "./Dashboard"
import {DirectoryExplorer} from "./DirectoryExplorer"
import {LargestFiles} from "./LargestFiles"

function ResultDisplayComponent(props: {display: ResultDisplay}): JSX.Element {
    switch (props.display) {
        case ResultDisplay.DASHBOARD:
            return <Dashboard />
        case ResultDisplay.DIRECTORIES:
            return <DirectoryExplorer />
        case ResultDisplay.FILES:
            return <LargestFiles />
    }
}

export const ScanResults = observer(function ScanResult(): JSX.Element {
    const mainStore = React.useContext(AppStoreContext)
    const resultDisplay = mainStore.resultDisplay
    const classes = useStyles({})

    return (
        <Page>
            <div className={classes.root}>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    anchor="left"
                >
                    <div className={classes.toolbar} />
                    <Divider />
                    <List>
                        <ListItem
                            button
                            selected={resultDisplay === ResultDisplay.DASHBOARD}
                            onClick={() =>
                                mainStore.setResultDisplay(
                                    ResultDisplay.DASHBOARD
                                )
                            }
                        >
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Overview" />
                        </ListItem>
                        <ListItem
                            button
                            selected={resultDisplay === ResultDisplay.FILES}
                            onClick={() =>
                                mainStore.setResultDisplay(ResultDisplay.FILES)
                            }
                        >
                            <ListItemIcon>
                                <FileIcon />
                            </ListItemIcon>
                            <ListItemText primary="Largest Files" />
                        </ListItem>
                        <ListItem
                            button
                            selected={
                                resultDisplay === ResultDisplay.DIRECTORIES
                            }
                            onClick={() =>
                                mainStore.setResultDisplay(
                                    ResultDisplay.DIRECTORIES
                                )
                            }
                        >
                            <ListItemIcon>
                                <FolderIcon />
                            </ListItemIcon>
                            <ListItemText primary="Explore" />
                        </ListItem>
                        <ListItem>
                            <ScanFolderButton title="New Scan" />
                        </ListItem>
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <ResultDisplayComponent display={resultDisplay} />
                </main>
            </div>
        </Page>
    )
})
