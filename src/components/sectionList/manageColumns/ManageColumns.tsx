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
import React, { useEffect, useMemo, useState } from 'react'
import { getColumnsForSection, getTranslatedProperty } from '../../../constants'
import { useModelSectionHandleOrThrow } from '../../../lib'
import { useSelectedColumns } from './useSelectedColumns'

type ManageColumnsDialogProps = {
    onClose: () => void
}
export const ManageColumnsDialog = ({ onClose }: ManageColumnsDialogProps) => {
    const {
        columns: savedColumns,
        query,
        saveColumns,
        mutation,
    } = useSelectedColumns()

    const section = useModelSectionHandleOrThrow()
    const [pendingSelectedColumns, setPendingSelectedColumns] = useState<
        string[]
    >([])
    const columnsConfig = getColumnsForSection(section.name)

    useEffect(() => {
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
                    enableOrderChange
                    leftHeader={<p>{i18n.t('Available table columns')}</p>}
                    rightHeader={i18n.t('Selected table columns')}
                    onChange={handleChange}
                    loading={query.isLoading}
                    loadingPicked={query.isLoading}
                    options={transferOptions}
                    selected={pendingSelectedColumns}
                />
                <Button
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
