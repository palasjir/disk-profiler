import * as React from "react"
import {
    Avatar,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
} from "@material-ui/core"
import {
    ChevronRight,
    Folder as FolderIcon,
    InsertDriveFile as FileIcon,
} from "@material-ui/icons"
import styled from "styled-components"
import {formatItems, formatSize} from "../../utils/format"
import {DirListItemType} from "../../commons/types"
import {useAppStore} from "../../store/AppStoreContext"

const RightContainer = styled.div<{spacingFromRight: boolean}>`
    display: flex;
    align-items: center;
    ${props => props.spacingFromRight && "margin-right: 44px"};
    & > :not(:last-child) {
        margin-right: 8px;
    }
`

export interface DirListItemProps {
    readonly type: DirListItemType
    readonly name: string
    readonly size: number
    readonly itemCount?: number
}

function ListItemIcon(props: {type: DirListItemType}): JSX.Element {
    switch (props.type) {
        case DirListItemType.FILE:
            return <FileIcon />
        case DirListItemType.FOLDER:
            return <FolderIcon />
    }
}

export function DirListItem(props: DirListItemProps): JSX.Element {
    const store = useAppStore()
    const {type, name, itemCount, size} = props

    return (
        <ListItem divider>
            <ListItemAvatar>
                <Avatar>
                    <ListItemIcon type={type} />
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={name} secondary={formatItems(itemCount)} />
            <ListItemSecondaryAction>
                <RightContainer
                    spacingFromRight={type === DirListItemType.FILE}
                >
                    <ListItemText primary={formatSize(size)} />
                    {type === DirListItemType.FOLDER && (
                        <IconButton
                            edge="end"
                            aria-label="enter folder"
                            onClick={() =>
                                store.dirExplorerStore.navigateToDir(name)
                            }
                        >
                            <ChevronRight />
                        </IconButton>
                    )}
                </RightContainer>
            </ListItemSecondaryAction>
        </ListItem>
    )
}
