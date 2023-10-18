import { FetchError } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, Field, NoticeBox, Transfer } from '@dhis2/ui'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    getColumnsForSection,
    useModelSectionHandleOrThrow,
} from '../../../lib'
import css from './ManageListView.module.css'
import { useModelListView, useMutateModelListViews } from './useModelListView'

interface RenderProps {
    handleSave: () => void
    isSaving: boolean
}
type ManageColumnsDialogProps = {
    onSaved: () => void
    children: (props: RenderProps) => React.ReactNode
}

const toPath = (propertyDescriptor: { path: string }) => propertyDescriptor.path

export const ManageListView = ({
    onSaved,
    children,
}: ManageColumnsDialogProps) => {
    const section = useModelSectionHandleOrThrow()
    // ignore updates to saved-columns while selecting
    const isTouched = useRef(false)

    const { columns: savedColumns, query } = useModelListView()
    const [pendingSelectedColumns, setPendingSelectedColumns] = useState<
        string[]
    >(() => savedColumns.map(toPath))
    const [error, setError] = useState<string | undefined>()
    const [saveError, setSaveError] = useState<FetchError | undefined>()

    const { saveColumns, mutation } = useMutateModelListViews()

    const columnsConfig = getColumnsForSection(section.name)

    useEffect(() => {
        // if savedColumns were to update while selecting (it shouldn't )
        // make sure to not overwrite the selected columns
        if (isTouched.current) {
            return
        }
        setPendingSelectedColumns(savedColumns.map(toPath))
    }, [savedColumns])

    const handleSave = () => {
        if (pendingSelectedColumns.length < 1) {
            setError(i18n.t('At least one column must be selected'))
            return
        }
        saveColumns(pendingSelectedColumns, {
            onSuccess: () => onSaved(),
            onError: (error) => {
                if (error instanceof FetchError) {
                    setSaveError(error)
                }
            },
        })
    }

    const handleChange = ({ selected }: { selected: string[] }) => {
        isTouched.current = true

        setPendingSelectedColumns(selected)
        setError(undefined)
        setSaveError(undefined)
    }

    const handleSetDefault = () => {
        handleChange({ selected: columnsConfig.default.map(toPath) })
    }

    const transferOptions = useMemo(
        () =>
            columnsConfig.available
                .map((column) => ({
                    label: column.label,
                    value: column.path,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)),
        [columnsConfig.available]
    )

    return (
        <>
            <Field error={!!error} validationText={error} name={'columns'}>
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
            </Field>
            <Button
                className={css.resetDefaultButton}
                small
                secondary
                onClick={handleSetDefault}
                disabled={mutation.isLoading}
            >
                {i18n.t('Reset to default columns')}
            </Button>
            {saveError && (
                <p>
                    <NoticeBox error title={i18n.t('Failed to save')}>
                        {saveError.message}
                    </NoticeBox>
                </p>
            )}
            {children({ handleSave, isSaving: mutation.isLoading })}
        </>
    )
}

const TransferHeader = ({ children }: React.PropsWithChildren) => (
    <div className={css.transferHeader}>{children}</div>
)
