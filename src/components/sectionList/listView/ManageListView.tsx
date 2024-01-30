import { FetchError } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, Field, NoticeBox, Transfer, TransferOption } from '@dhis2/ui'
import { FORM_ERROR } from 'final-form'
import React, { useMemo } from 'react'
import { Form, useField } from 'react-final-form'
import {
    getColumnsForSection,
    getFiltersForSection,
    useModelSectionHandleOrThrow,
} from '../../../lib'
import css from './ManageListView.module.css'
import { useModelListView, useMutateModelListViews } from './useModelListView'

interface RenderProps {
    submitting: boolean
}

type ManageColumnsDialogProps = {
    onSaved: () => void
    children: (props: RenderProps) => React.ReactNode
}

const toPath = (propertyDescriptor: { path: string }) => propertyDescriptor.path

type FormValues = {
    columns: string[]
    filters: string[]
}
const validate = (values: FormValues) => {
    const errors: Record<string, string> = {}

    if (values.columns.length < 1) {
        errors.columns = i18n.t('At least one column must be selected')
    }
    if (values.filters.length < 1) {
        errors.filters = i18n.t('At least one filter must be selected')
    }
    return errors
}
export const ManageListView = ({
    onSaved,
    children,
}: ManageColumnsDialogProps) => {
    const {
        columns: savedColumns,
        filters: savedFilters,
        query,
    } = useModelListView()
    const section = useModelSectionHandleOrThrow()
    const { saveView } = useMutateModelListViews()

    const columnsConfig = getColumnsForSection(section.name)
    const filtersConfig = getFiltersForSection(section.name)

    const handleSave = async (values: FormValues) => {
        const view = {
            name: 'default',
            columns: values.columns,
            filters: values.filters,
        }

        return new Promise((resolve) => {
            saveView(view, {
                onSuccess: () => resolve(onSaved()),
                onError: (error) => {
                    if (error instanceof FetchError) {
                        resolve({ [FORM_ERROR]: error.message })
                    }
                    resolve({
                        [FORM_ERROR]: i18n.t('An unknown error occurred'),
                    })
                },
            })
        })
    }

    const initialValues = useMemo(() => {
        return {
            columns:
                savedColumns.length > 0
                    ? savedColumns.map(toPath)
                    : columnsConfig.default.map(toPath),
            filters:
                savedFilters.length > 0
                    ? savedFilters.map((f) => f.filterKey)
                    : filtersConfig.default.map((f) => f.filterKey),
        }
    }, [savedFilters, savedColumns, filtersConfig, columnsConfig])

    return (
        <>
            <Form
                onSubmit={handleSave}
                initialValues={initialValues}
                validate={validate}
            >
                {({ handleSubmit, submitting, submitError }) => (
                    <form onSubmit={handleSubmit}>
                        <TransferField
                            name={'columns'}
                            availableLabel={i18n.t('Available columns')}
                            selectedLabel={i18n.t('Selected columns')}
                            loading={query.isLoading}
                            defaultOptions={columnsConfig.default.map(
                                (c) => c.path
                            )}
                            availableOptions={columnsConfig.available.map(
                                (c) => ({ label: c.label, value: c.path })
                            )}
                        />
                        <TransferField
                            name={'filters'}
                            availableLabel={i18n.t('Available filters')}
                            selectedLabel={i18n.t('Selected filters')}
                            loading={query.isLoading}
                            defaultOptions={filtersConfig.default.map(
                                (c) => c.filterKey
                            )}
                            availableOptions={filtersConfig.available.map(
                                (c) => ({ label: c.label, value: c.filterKey })
                            )}
                        />
                        {submitError && (
                            <p>
                                <NoticeBox
                                    error
                                    title={i18n.t('Failed to save')}
                                >
                                    {submitError}
                                </NoticeBox>
                            </p>
                        )}
                        {children({
                            submitting,
                        })}
                    </form>
                )}
            </Form>
        </>
    )
}

type TransferField = {
    name: string
    loading?: boolean
    defaultOptions: string[]
    availableOptions: TransferOption[]
    availableLabel: string
    selectedLabel: string
}
const TransferField = ({
    name,
    loading,
    defaultOptions,
    availableOptions,
    availableLabel,
    selectedLabel,
}: TransferField) => {
    const { input, meta } = useField(name, {
        multiple: true,
    })
    const handleSetDefault = () => {
        input.onChange(defaultOptions)
    }
    return (
        <div>
            <Field
                error={!!meta.error}
                validationText={meta.error}
                name={'columns'}
            >
                <Transfer
                    className={css.transferContainer}
                    height={'320px'}
                    loading={loading}
                    enableOrderChange
                    leftHeader={
                        <TransferHeader>{availableLabel}</TransferHeader>
                    }
                    rightHeader={
                        <TransferHeader>{selectedLabel}</TransferHeader>
                    }
                    selected={input.value}
                    onChange={({ selected }) => input.onChange(selected)}
                    options={availableOptions}
                    rightFooter={
                        <Button
                            className={css.resetDefaultButton}
                            small
                            secondary
                            onClick={handleSetDefault}
                            disabled={meta.submitting}
                        >
                            {i18n.t('Reset to default')}
                        </Button>
                    }
                />
            </Field>
        </div>
    )
}

const TransferHeader = ({ children }: React.PropsWithChildren) => (
    <div className={css.transferHeader}>{children}</div>
)
