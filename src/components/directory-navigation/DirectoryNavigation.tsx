import * as React from "react"
import {Breadcrumbs, Button, Grid, Link} from "@material-ui/core"
import {ChevronRight, ChevronLeft} from "@material-ui/icons"
import {NormalizedPath} from "../../utils/NormalizedPath"
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

    const items = pathRelativeToRoot.value.map((it, i) => {
        const fullPath = absolutePath.value.slice(0, i + 1).join("/")

        return (
            <Link key={fullPath} color="inherit">
                {it}
            </Link>
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
                <Breadcrumbs aria-label="breadcrumb">{items}</Breadcrumbs>
            </Grid>
        </Grid>
    )
}
