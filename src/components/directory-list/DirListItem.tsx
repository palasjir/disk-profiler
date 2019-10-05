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
import {formatSize} from "../../utils/format"
import {DirListItemType} from "../../commons/types"
import {useAppStore} from "../../store/AppStoreContext"

interface RightContainerProps {
    readonly spacingFromRight: boolean
}

const RightContainer = styled.div<RightContainerProps>`
    display: flex;
    align-items: center;
    ${props => props.spacingFromRight && "margin-right: 44px"};
    & > :not(:last-child) {
        margin-right: 8px;
    }
`

interface DirListItemProps {
    readonly type: DirListItemType
    readonly name: string
    readonly size: number
    readonly itemCount?: number
}

function getIcon(type: DirListItemType) {
    switch (type) {
        case DirListItemType.FILE:
            return <FileIcon />
        case DirListItemType.FOLDER:
            return <FolderIcon />
    }
}

function formatItems(count?: number): string {
    if (!count) return ""
    return count === 1 ? `1 item` : `${count} items`
}

export function DirListItem(props: DirListItemProps): JSX.Element {
    const {type, name, itemCount, size} = props

    const store = useAppStore()

    function handleClick() {
        store.dirExplorerStore.navigateToDir(name)
    }

    return (
        <ListItem divider>
            <ListItemAvatar>
                <Avatar>{getIcon(type)}</Avatar>
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
                            onClick={handleClick}
                        >
                            <ChevronRight />
                        </IconButton>
                    )}
                </RightContainer>
            </ListItemSecondaryAction>
        </ListItem>
    )
}
