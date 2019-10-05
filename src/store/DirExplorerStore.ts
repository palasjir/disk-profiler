import {action, computed, observable} from "mobx"
import {
    DirListItemModel,
    ToScannerMessage,
    ToScannerMessageType,
} from "../commons/types"
import {ipcRenderer} from "electron"
import {EVENT_MSG_TO_SCANNER} from "../commons/constants"
import {NormalizedPath} from "../utils/NormalizedPath"

export class DirExplorerStore {
    @observable
    public normalizedRootPath: NormalizedPath = new NormalizedPath()

    @observable
    public currentPathRelativeToRoot: NormalizedPath = new NormalizedPath()

    @observable
    public items: DirListItemModel[] = []

    @observable
    public isLoading = false

    public readonly initialize = (normalizedRootPath: NormalizedPath): void => {
        this.normalizedRootPath = normalizedRootPath
    }

    public readonly loadDirectory = async (
        normalizedPathRelativeToRoot: NormalizedPath
    ): Promise<void> => {
        if (this.isLoading) {
            return
        }

        this.isLoading = true
        this.currentPathRelativeToRoot = normalizedPathRelativeToRoot
        const normalizedAbsolutePath = this.normalizedRootPath.join(
            normalizedPathRelativeToRoot
        )
        const msg: ToScannerMessage = {
            type: ToScannerMessageType.GET_DIRECTORY_EXPLORER_DATA,
            data: {
                rawNormalizedAbsolutePath: normalizedAbsolutePath.value,
            },
        }
        ipcRenderer.send(EVENT_MSG_TO_SCANNER, msg)
    }

    @action
    public update(items: DirListItemModel[]) {
        this.isLoading = false
        this.items = items
    }

    @computed
    public get hasPrevious(): boolean {
        return !this.currentPathRelativeToRoot.isEmpty
    }

    @action
    public previous(): void {
        const lastIndex = this.currentPathRelativeToRoot.length - 1
        const pathRelativeToRoot = this.currentPathRelativeToRoot.slice(
            0,
            lastIndex
        )
        this.loadDirectory(pathRelativeToRoot)
    }

    @action
    public navigateToDir(name: string) {
        const pathRelativeToRoot = this.currentPathRelativeToRoot.join(
            new NormalizedPath(name)
        )
        this.loadDirectory(pathRelativeToRoot)
    }
}
