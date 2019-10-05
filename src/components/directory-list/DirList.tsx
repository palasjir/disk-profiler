import * as React from "react"
import {List} from "@material-ui/core"
import {DirListItem} from "./DirListItem"
import {DirListItemModel} from "../../commons/types"

export interface DirListProps {
    readonly items: DirListItemModel[]
}

export function DirList(props: DirListProps): JSX.Element {
    const {items} = props
    return (
        <List>
            {items.map(it => (
                <DirListItem
                    key={it.name}
                    type={it.type}
                    name={it.name}
                    itemCount={it.itemCount}
                    size={it.size}
                />
            ))}
        </List>
    )
}
