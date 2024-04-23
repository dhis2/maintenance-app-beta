import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react'
import { BulkSharingDialog } from '../bulk/BulkSharingDialog'

type DialogType = 'manageViews' | 'bulkSharing' | 'download' | 'sharing'

interface BaseDialogType {
    type: DialogType
    props: BaseDialogProps
}

interface BaseDialogProps {
    onClose: () => void
}

interface SharingDialogType extends BaseDialogType {
    type: 'sharing'
    props: BaseDialogProps & {
        id: string
        type: string
    }
}

interface BulkSharingDialogType extends BaseDialogType {
    type: 'bulkSharing'
    props: BaseDialogProps & {
        selectedModels: Set<string>
    }
}

interface DownloadDialogType extends BaseDialogType {
    type: 'download'
    props: BaseDialogProps & {
        selectedModels: Set<string>
    }
}

interface ManageListViewDialogType extends BaseDialogType {
    type: 'manageViews'
    props: BaseDialogProps
}

type Dialogs =
    | SharingDialogType
    | BulkSharingDialogType
    | DownloadDialogType
    | ManageListViewDialogType

type GetDialogProps<TDialogType extends DialogType> = Extract<
    Dialogs,
    { type: TDialogType }
>['props']

type ListDialogContextValue = {
    dialog: Dialogs | undefined
    open: (dialog: Dialogs) => void
    handleClose: () => void
}

export const ListDialogContext =
    createContext<ListDialogContextValue>(undefined)

const useListContext = () => useContext(ListDialogContext)

const useListDialog = () => {
    // const [dialogOpen, setDialogType] = useState<DialogType | undefined>(undefined)
    const [dialog, setDialog] = useState<Dialogs | undefined>(undefined)

    const openDialog = useCallback<ListDialogContextValue['open']>(
        (dialog) => {
            setDialog(dialog)
        },
        [setDialog]
    )

    const closeDialog = useCallback(() => {
        setDialog(undefined)
        dialog?.props.onClose()
    }, [setDialog, dialog])

    return { handleClose: closeDialog, dialog, openDialog }
}

export const ListDialogProvider = ({
    children,
    value,
}: {
    children: React.ReactNode
    value: ListDialogContextValue
}) => {
    const contextValue = useListDialog()

    contextValue.openDialog({
        type: 'bulkSharing',
        props: { selectedModels: new Set() },
    })
    return (
        <ListDialogContext.Provider value={contextValue}>
            {children}
        </ListDialogContext.Provider>
    )
}

const ListDialogs = () => {
    const { dialog, handleClose } = useListContext()

    if (!dialog) {
        return null
    }

    switch (dialog.type) {
        case 'bulkSharing': {
            return <BulkSharingDialog {...dialog.props} onClose={handleClose} />
        }
    }
}
