import * as React from "react"
import {Breadcrumbs, Button, Grid, Link, Typography} from "@material-ui/core"
import {ChevronLeft} from "@material-ui/icons"
import {NormalizedPath} from "../../models/NormalizedPath"
import {useAppStore} from "../../store/AppStoreContext"

export interface DirectoryNavigationProps {
    readonly rootPath: NormalizedPath
    readonly absolutePath: NormalizedPath
}

export function DirectoryNavigation(
    props: DirectoryNavigationProps
): JSX.Element {
    const {rootPath, absolutePath} = props

    const pathRelativeToRoot = absolutePath.removeRoot(rootPath)
    const store = useAppStore()
    const dirExpStore = store.dirExplorerStore

    const breadcrumbItems = pathRelativeToRoot.value.map((it, i) => {
        const fullPath = absolutePath.value.slice(0, i + 1).join("/")
        const color =
            i === pathRelativeToRoot.length - 1 ? "textPrimary" : "inherit"
        return (
            <Typography key={fullPath} color={color}>
                {it}
            </Typography>
        )
    })

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item>
                <Button
                    disabled={!dirExpStore.hasPrevious}
                    variant="contained"
                    size="small"
                    onClick={() => dirExpStore.previous()}
                >
                    <ChevronLeft />
                </Button>
            </Grid>

            <Grid item>
                <Breadcrumbs aria-label="breadcrumb">
                    {breadcrumbItems}
                </Breadcrumbs>
            </Grid>
        </Grid>
    )
}
