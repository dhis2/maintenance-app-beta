import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    DataTable,
    DataTableRow,
    DataTableCell,
    TableBody,
    TableFoot,
    Pagination,
    NoticeBox,
    CircularLoader,
} from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useState } from 'react'
import { useField } from 'react-final-form'
import { TranslationDialog } from '../../../../components/sectionList/translation'
import { SchemaName } from '../../../../lib'
import css from './OptionList.module.css'
import { Option, OptionDetail, MAXIMUM_OPTIONS } from './optionsConstants'
import { OptionsErrorNotice } from './OptionsErrorNotice'
import {
    FilterAndSort,
    FilterWarning,
    TableHeadLayout,
    OptionRow,
} from './OptionsListTable'

export const OptionsListUnSortable = ({
    modelId,
    optionsCount,
    initialOptions,
    manuallyDeleted,
}: {
    modelId: string
    optionsCount: number
    initialOptions: Option[]
    manuallyDeleted: string
}) => {
    useField('options', {
        initialValue: initialOptions,
    })
    return (
        <OptionsListUnSortableInner
            modelId={modelId}
            optionsCount={optionsCount}
            manuallyDeleted={manuallyDeleted}
        />
    )
}

const OptionsListUnSortableInner = ({
    modelId,
    optionsCount,
    manuallyDeleted,
}: {
    modelId: string
    optionsCount: number
    manuallyDeleted: string
}) => {
    const engine = useDataEngine()
    const [pageCount, setPageCount] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [filterValue, setFilterValue] = useState<string | undefined>()
    const [sortOrdering, setSortOrdering] = useState<string | undefined>()

    const { input: optionsInput } = useField('options')

    const [translationDialogModel, setTranslationDialogModel] = useState<
        OptionDetail | undefined
    >()

    // in this case, we will only keep track of deleted options

    const onDelete = useCallback(
        (id: string) => {
            const newOptions = [...optionsInput.value]
            newOptions.push({ id, deleted: true })
            optionsInput.onChange(newOptions)
        },
        [optionsInput]
    )

    const undoDelete = useCallback(
        (id: string) => {
            const newOptions = [...optionsInput.value].filter(
                (option) => option.id !== id
            )
            optionsInput.onChange(newOptions)
        },
        [optionsInput]
    )

    const sortOptions = useCallback(
        (property: string, desc: boolean) => {
            if (property) {
                if (desc === true) {
                    setSortOrdering(`${property}:desc`)
                } else {
                    setSortOrdering(`${property}:asc`)
                }
            }
        },
        [setSortOrdering]
    )

    const filters =
        filterValue && filterValue.length >= 2
            ? [
                  `optionSet.id:eq:${modelId}`,
                  `identifiable:token:${filterValue}`,
              ]
            : [`optionSet.id:eq:${modelId}`]

    if (manuallyDeleted.length) {
        filters.push(`id:neq:${manuallyDeleted}`)
    }

    const query = {
        result: {
            resource: 'options',
            params: {
                fields: ['id', 'name', 'code', 'displayName', 'access'],
                pageSize,
                page: pageCount,
                filters,
                order: sortOrdering,
            },
        },
    }

    const { error, data } = useQuery({
        queryKey: [query],
        queryFn: ({ queryKey: [query], signal }) => {
            return engine.query(query, { signal }) as any
        },
    })

    if (error) {
        return <OptionsErrorNotice />
    }

    const options = data?.result.options
    const totalLength = data?.result?.pager?.total
    const totalPageCount = data?.result?.pager?.pageCount

    return (
        <>
            <FilterAndSort
                filterValue={filterValue}
                setFilterValue={setFilterValue}
                sortOptions={sortOptions}
                disableSort={true}
            />
            <FilterWarning
                filter={filterValue}
                hiddenRowsCount={optionsCount - totalLength}
            />
            <div className={css.sortDisabledWarning}>
                <NoticeBox>
                    {i18n.t(
                        'Sort functionality is not available with more than {{maximumNumberOfOptions}} options',
                        { maximumNumberOfOptions: MAXIMUM_OPTIONS }
                    )}
                </NoticeBox>
            </div>
            <DataTable>
                <TableHeadLayout />
                {data ? (
                    <TableBody>
                        {options?.map((option: OptionDetail, index: number) => (
                            <OptionRow
                                key={option.id}
                                deleted={
                                    optionsInput.value
                                        ? optionsInput.value
                                              .map((opt: Option) => opt.id)
                                              .includes(option.id)
                                        : false
                                }
                                optionDetail={option}
                                disableManualSort={true}
                                totalLength={totalLength}
                                index={index + pageSize * (pageCount - 1)}
                                undoDelete={undoDelete}
                                onDelete={onDelete}
                                onMove={() => {}}
                                setTranslationDialogModelID={() => {
                                    setTranslationDialogModel(option)
                                }}
                            />
                        ))}
                    </TableBody>
                ) : (
                    <DataTableCell colSpan="100%">
                        <div className={css.optionsLoadingDiv}>
                            <CircularLoader small />
                        </div>
                    </DataTableCell>
                )}

                <TableFoot>
                    <DataTableRow>
                        <DataTableCell colSpan="100%">
                            <Pagination
                                page={pageCount}
                                pageSize={pageSize}
                                pageCount={totalPageCount}
                                total={totalLength}
                                onPageSizeChange={(v) => {
                                    setPageSize(v)
                                }}
                                onPageChange={(v) => {
                                    setPageCount(v)
                                }}
                            />
                        </DataTableCell>
                    </DataTableRow>
                </TableFoot>
            </DataTable>
            {translationDialogModel && (
                <TranslationDialog
                    model={translationDialogModel}
                    onClose={() => {
                        setTranslationDialogModel(undefined)
                    }}
                    schemaName={SchemaName.option}
                />
            )}
        </>
    )
}
