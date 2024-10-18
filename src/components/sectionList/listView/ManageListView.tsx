import { FetchError } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Field,
    NoticeBox,
    Tab,
    TabBar,
    Transfer,
    TransferOption,
} from '@dhis2/ui'
import { FORM_ERROR } from 'final-form'
import React, { SyntheticEvent, useMemo } from 'react'
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
const toFilterKey = (filterDescriptor: { filterKey: string }) =>
    filterDescriptor.filterKey

type FormValues = {
    columns: string[]
    filters: string[]
}

const validate = (values: FormValues) => {
    const errors: Record<string, string> = {}

    if (values.columns.length < 1) {
        errors.columns = i18n.t('At least one column must be selected')
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
    const [selectedTab, setSelectedTab] = React.useState<'columns' | 'filters'>(
        'columns' as const
    )
    const section = useModelSectionHandleOrThrow()
    const { saveView } = useMutateModelListViews()

    const { defaultColumns, defaultFilters, columnsConfig, filtersConfig } =
        useMemo(() => {
            const columnsConfig = getColumnsForSection(section.name)
            const filtersConfig = getFiltersForSection(section.name)

            const defaultColumns = columnsConfig.default.map(toPath)
            const defaultFilters = filtersConfig.default.map(toFilterKey)
            return {
                defaultColumns,
                defaultFilters,
                columnsConfig,
                filtersConfig,
            }
        }, [section.name])

    const handleSave = async (values: FormValues) => {
        const isDefault = (arr: string[], def: string[]) =>
            arr.join() === def.join()

        // save empty view if default, this makes the app able to update the default view
        const view = {
            name: 'default',
            columns: isDefault(values.columns, defaultColumns)
                ? []
                : values.columns,
            filters: isDefault(values.filters, defaultFilters)
                ? []
                : values.filters,
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
                    : defaultColumns,
            filters:
                savedFilters.length > 0
                    ? savedFilters.map(toFilterKey)
                    : defaultFilters,
        }
    }, [savedFilters, savedColumns, defaultColumns, defaultFilters])

    const handleChangeTab = (tab: 'columns' | 'filters', e: SyntheticEvent) => {
        e.preventDefault()
        setSelectedTab(tab)
    }

    return (
        <Form
            onSubmit={handleSave}
            initialValues={initialValues}
            validate={validate}
        >
            {({ handleSubmit, submitting, submitError }) => (
                <form onSubmit={handleSubmit}>
                    <TabBar>
                        <Tab
                            selected={selectedTab === 'columns'}
                            onClick={(_, e) => handleChangeTab('columns', e)}
                        >
                            {i18n.t('Columns')}
                        </Tab>
                        <Tab
                            selected={selectedTab === 'filters'}
                            onClick={(_, e) => handleChangeTab('filters', e)}
                        >
                            {i18n.t('Filters')}
                        </Tab>
                    </TabBar>

                    <TabContent show={selectedTab === 'columns'}>
                        <TransferField
                            name={'columns'}
                            availableLabel={i18n.t('Available columns')}
                            selectedLabel={i18n.t('Selected columns')}
                            loading={query.isLoading}
                            defaultOptions={defaultColumns}
                            availableOptions={columnsConfig.available.map(
                                (c) => ({
                                    label: c.label,
                                    value: c.path,
                                })
                            )}
                        />
                    </TabContent>
                    <TabContent show={selectedTab === 'filters'}>
                        <TransferField
                            name={'filters'}
                            availableLabel={i18n.t('Available filters')}
                            selectedLabel={i18n.t('Selected filters')}
                            loading={query.isLoading}
                            defaultOptions={defaultFilters}
                            availableOptions={filtersConfig.available.map(
                                (f) => ({
                                    label: f.label,
                                    value: f.filterKey,
                                })
                            )}
                        />
                    </TabContent>
                    {submitError && (
                        <p>
                            <NoticeBox error title={i18n.t('Failed to save')}>
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

const TabContent = ({
    children,
    show,
}: React.PropsWithChildren<{ show: boolean }>) => (
    <div style={{ display: show ? 'initial' : 'none' }}>{children}</div>
)
