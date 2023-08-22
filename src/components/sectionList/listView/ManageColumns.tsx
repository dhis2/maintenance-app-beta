import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    Button,
    ButtonStrip,
    Transfer,
} from '@dhis2/ui'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getTranslatedProperty, getColumnsForSection } from '../../../constants'
import { useModelSectionHandleOrThrow } from '../../../lib'
import css from './ManageColumns.module.css'
import {
    useMutateSelectedColumns,
    useSelectedColumns,
} from './useSelectedColumns'

type ManageColumnsDialogProps = {
    onClose: () => void
}
export const ManageColumnsDialog = ({ onClose }: ManageColumnsDialogProps) => {
    const section = useModelSectionHandleOrThrow()
    const [pendingSelectedColumns, setPendingSelectedColumns] = useState<
        string[]
    >([])
    // ignore updates to saved-columns while selecting
    const isTouched = useRef(false)

    const { columns: savedColumns, query } = useSelectedColumns()
    const { saveColumns, mutation } = useMutateSelectedColumns()

    const columnsConfig = getColumnsForSection(section.name)
    columnsConfig.available

    useEffect(() => {
        // if savedColumns were to update while selecting (it shouldn't )
        // make sure to not overwrite the selected columns
        if (isTouched.current) {
            return
        }
        setPendingSelectedColumns(savedColumns)
    }, [savedColumns])

    const handleSave = () => {
        saveColumns(pendingSelectedColumns, {
            onSuccess: () => onClose(),
        })
    }

    const handleSetDefault = () => {
        setPendingSelectedColumns(columnsConfig.default)
    }

    const handleChange = ({ selected }: { selected: string[] }) => {
        isTouched.current = true
        setPendingSelectedColumns(selected)
    }

    const transferOptions = useMemo(
        () =>
            columnsConfig.available
                .map((column) => ({
                    label: getTranslatedProperty(column),
                    value: column,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)),
        [columnsConfig.available]
    )

    return (
        <Modal onClose={onClose} position="top">
            <ModalTitle>
                {i18n.t('Manage {{section}} table columns', {
                    section: section.title,
                })}
            </ModalTitle>
            <ModalContent>
                <Transfer
                    height={'320px'}
                    enableOrderChange
                    leftHeader={
                        <TransferHeader>
                            {i18n.t('Available table columns')}
                        </TransferHeader>
                    }
                    rightHeader={
                        <TransferHeader>
                            {i18n.t('Selected table columns')}
                        </TransferHeader>
                    }
                    onChange={handleChange}
                    loading={query.isLoading}
                    loadingPicked={query.isLoading}
                    options={transferOptions}
                    selected={pendingSelectedColumns}
                />
                <Button
                    className={css.resetDefaultButton}
                    small
                    secondary
                    onClick={handleSetDefault}
                    disabled={mutation.isLoading}
                >
                    {i18n.t('Reset to default columns')}
                </Button>
                <ModalActions>
                    <ButtonStrip>
                        <Button onClick={onClose} secondary>
                            {i18n.t('Cancel')}
                        </Button>
                        <Button
                            onClick={handleSave}
                            primary
                            loading={mutation.isLoading}
                        >
                            {i18n.t('Update table columns')}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </ModalContent>
        </Modal>
    )
}

const TransferHeader = ({ children }: React.PropsWithChildren) => (
    <div className={css.transferHeader}>{children}</div>
)
