import * as React from "react"
import {AppStore} from "./AppStore"

export const AppStoreContext = React.createContext<AppStore | null>(null)

export function useAppStore(): AppStore {
    const store = React.useContext(AppStoreContext)

    if (!store) {
        throw new Error("AppStoreContext is missing!")
    }

    return store
}
