import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Input,
    ButtonStrip,
    Button,
    DataTable,
    DataTableColumnHeader,
    DataTableRow,
    DataTableCell,
    TableBody,
    TableHead,
    TableFoot,
    Pagination,
    IconArrowUp16,
    IconArrowDown16,
    IconEdit16,
    NoticeBox,
    CircularLoader,
} from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { useField } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    MoreDropdownButton,
    MoreDropdownItem,
    MoreDropdownDivider,
} from '../../../components'
import { TranslationDialog } from '../../../components/sectionList/translation'
import { SchemaName, BaseListModel } from '../../../lib'
import {
    PickWithFieldFilters,
    Option as OptionGenerated,
} from '../../../types/generated'
import css from './OptionList.module.css'

const OptionListNewOrEdit = ({
    manuallyDeleted,
}: {
    manuallyDeleted: string
}) => {
    const modelId = useParams().id as string
    // options cannot be added until option set is saved
    if (!modelId) {
        return (
            <NoticeBox>
                {i18n.t('Option set must be saved before options can be added')}
            </NoticeBox>
        )
    }
    return (
        <OptionsListSizeCheck
            modelId={modelId}
            manuallyDeleted={manuallyDeleted}
        />
    )
    // if edit mode, check count of options
}

const ErrorNotice = () => (
    <NoticeBox error>
        {i18n.t('Something went wrong when loading options')}
    </NoticeBox>
)

// check if there are 50 or fewer option
const OptionsListSizeCheck = ({
    modelId,
    manuallyDeleted,
}: {
    modelId: string
    manuallyDeleted: string
}) => {
    const engine = useDataEngine()
    const query = {
        result: {
            resource: `optionSets/${modelId}`,
            params: {
                fields: 'options~size',
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
        return <ErrorNotice />
    }
    if (!data) {
        return null
    }
    if (data?.result?.options > 50) {
        return (
            <OptionsListUnSortableSetup
                modelId={modelId}
                optionsCount={data.result.options}
                initialOptions={[]}
                manuallyDeleted={manuallyDeleted}
            />
        )
    }
    return <OptionsListSortable modelId={modelId} />
}

const OptionsListSortable = ({ modelId }: { modelId: string }) => {
    const engine = useDataEngine()
    const query = {
        result: {
            resource: `optionSets/${modelId}`,
            params: {
                fields: 'options[id]',
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
        return <ErrorNotice />
    }
    if (!data) {
        return null
    }
    const options = data?.result?.options ?? []

    return (
        <>
            <OptionsListTable
                modelId={modelId}
                options={options}
            ></OptionsListTable>
        </>
    )
}
export type Option = { id: string; deleted?: boolean }
type OptionDetail = BaseListModel & { name: string; code: string }
type OptionsDetails = Record<string, OptionDetail>

const FilterAndSort = ({
    filterValue,
    setFilterValue,
    sortOptions,
    disableSort = false,
}: {
    filterValue: string | undefined
    setFilterValue: (s: string | undefined) => void
    sortOptions: (property: string, desc: boolean) => void
    disableSort?: boolean
}) => (
    <>
        <div>
            <Input
                className={css.identifiableSelectionFilter}
                placeholder={i18n.t('Search by name or code')}
                onChange={(e) => setFilterValue(e.value)}
                value={filterValue}
                dense
            />
        </div>
        <div className={css.sortButtons}>
            <ButtonStrip>
                <Button>{i18n.t('Add option')}</Button>
                {!disableSort && (
                    <ButtonStrip>
                        <Button
                            disabled={!!filterValue}
                            onClick={() => sortOptions('name', false)}
                        >
                            {i18n.t('Sort by name (A-Z)')}
                        </Button>
                        <Button
                            disabled={!!filterValue}
                            onClick={() => sortOptions('name', true)}
                        >
                            {i18n.t('Sort by name (Z-A)')}
                        </Button>
                        <Button
                            disabled={!!filterValue}
                            onClick={() => sortOptions('code', false)}
                        >
                            {i18n.t('Sort by code (asc)')}
                        </Button>
                        <Button
                            disabled={!!filterValue}
                            onClick={() => sortOptions('code', true)}
                        >
                            {i18n.t('Sort by code (desc)')}
                        </Button>
                    </ButtonStrip>
                )}
            </ButtonStrip>
        </div>
    </>
)

const OptionsListTable = ({
    modelId,
    options,
}: {
    modelId: string
    options: { id: string }[]
}) => {
    const { input: optionsInput } = useField('options', {
        initialValue: options,
    })
    const [filterValue, setFilterValue] = useState<string | undefined>()
    const engine = useDataEngine()
    const query = {
        result: {
            resource: `optionSets/${modelId}`,
            params: {
                fields: 'options[id,name,code,displayName,access]',
            },
        },
    }

    const { error, data } = useQuery({
        queryKey: [query],
        queryFn: ({ queryKey: [query], signal }) => {
            return engine.query(query, { signal }) as any
        },
    })
    const optionsDetails = useMemo(
        () =>
            data?.result?.options?.reduce(
                (acc: OptionsDetails, cv: OptionDetail) => {
                    acc[cv.id] = cv
                    return acc
                },
                {} as OptionsDetails
            ),
        [data]
    )

    const sortOptions = useCallback(
        (property: string, desc: boolean) => {
            const newOptionsOrder = [...optionsInput.value]
            if (desc) {
                newOptionsOrder.sort((a, b) =>
                    optionsDetails[b.id][property].localeCompare(
                        optionsDetails[a.id][property],
                        undefined,
                        { numeric: true, sensitivity: 'base' }
                    )
                )
            } else {
                newOptionsOrder.sort((a, b) =>
                    optionsDetails[a.id][property].localeCompare(
                        optionsDetails[b.id][property],
                        undefined,
                        { numeric: true, sensitivity: 'base' }
                    )
                )
            }
            optionsInput.onChange(newOptionsOrder)
        },
        [optionsInput, optionsDetails]
    )

    if (error) {
        return <ErrorNotice />
    }
    if (!data) {
        return null
    }

    return (
        <>
            <FilterAndSort
                filterValue={filterValue}
                setFilterValue={setFilterValue}
                sortOptions={sortOptions}
            />
            <OptionsTable
                optionsDetails={optionsDetails}
                filter={filterValue ?? ''}
            />
        </>
    )
}

const TableHeadLayout = () => (
    <TableHead>
        <DataTableRow>
            <DataTableColumnHeader>{i18n.t('Name')}</DataTableColumnHeader>
            <DataTableColumnHeader>{i18n.t('Code')}</DataTableColumnHeader>
            <DataTableColumnHeader> </DataTableColumnHeader>
        </DataTableRow>
    </TableHead>
)

const FilterWarning = ({
    filter,
    hiddenRowsCount,
}: {
    filter: string | undefined
    hiddenRowsCount: number
}) => {
    if (!filter || isNaN(hiddenRowsCount)) {
        return null
    }
    return (
        <p>
            {i18n.t(
                '{{hiddenRowsCount}} rows are hidden due to filter. Sorting is disabled while filter is defined.',
                {
                    hiddenRowsCount,
                }
            )}
        </p>
    )
}

const OptionRow = ({
    deleted,
    optionDetail,
    disableManualSort,
    totalLength,
    index,
    undoDelete,
    onDelete,
    onMove,
    setTranslationDialogModelID,
}: {
    deleted: boolean
    optionDetail: OptionDetail
    disableManualSort: boolean
    totalLength: number
    index: number
    undoDelete: (id: string) => void
    onDelete: (id: string) => void
    onMove: (id: string, moveIndexBy: number) => void
    setTranslationDialogModelID: (id: string) => void
}) => (
    <DataTableRow
        className={deleted ? css.deletedRow : ''}
        key={optionDetail.id}
    >
        <DataTableCell>{optionDetail?.name}</DataTableCell>
        <DataTableCell>{optionDetail?.code}</DataTableCell>
        <DataTableCell>
            <div className={css.actionButtons}>
                {deleted ? (
                    <div className={css.deletedOption}>
                        <span>{i18n.t('Will be removed on save')}</span>
                        <Button
                            small
                            onClick={() => undoDelete(optionDetail.id)}
                        >
                            {i18n.t('Restore option')}
                        </Button>
                    </div>
                ) : (
                    <ButtonStrip>
                        {!disableManualSort && (
                            <ButtonStrip>
                                <Button
                                    small
                                    className={css.wideButton}
                                    secondary
                                    icon={<IconArrowUp16 />}
                                    onClick={() => onMove(optionDetail.id, -1)}
                                    disabled={index === 0}
                                />
                                <Button
                                    small
                                    className={css.wideButton}
                                    secondary
                                    icon={<IconArrowDown16 />}
                                    onClick={() => onMove(optionDetail.id, 1)}
                                    disabled={index === totalLength - 1}
                                />
                            </ButtonStrip>
                        )}
                        <Button
                            small
                            className={css.wideButton}
                            secondary
                            icon={<IconEdit16 />}
                        />
                        <MoreDropdownButton>
                            <MoreDropdownItem label={i18n.t('Edit')} />
                            {optionDetail.access !== undefined && (
                                <MoreDropdownItem
                                    label={i18n.t('Translate')}
                                    onClick={() => {
                                        setTranslationDialogModelID(
                                            optionDetail.id
                                        )
                                    }}
                                />
                            )}
                            <MoreDropdownDivider />
                            <MoreDropdownItem
                                label={i18n.t('Delete')}
                                destructive
                                onClick={() => onDelete(optionDetail.id)}
                            />
                        </MoreDropdownButton>
                    </ButtonStrip>
                )}
            </div>
        </DataTableCell>
    </DataTableRow>
)

const OptionsTable = ({
    optionsDetails,
    filter,
}: {
    optionsDetails: OptionsDetails
    filter: string
}) => {
    const { input: optionsInput } = useField('options')
    const [pageSize, setPageSize] = useState<number>(10)
    const [pageCount, setPageCount] = useState<number>(1)

    const [translationDialogModelID, setTranslationDialogModelID] = useState<
        string | undefined
    >()

    const onMove = (id: string, moveIndexBy: number) => {
        const newOptionsOrder = [...optionsInput.value]
        const index = newOptionsOrder.findIndex((s) => s.id === id)
        newOptionsOrder.splice(index, 1)
        newOptionsOrder.splice(index + moveIndexBy, 0, { id })
        optionsInput.onChange(newOptionsOrder)
    }

    const onDelete = (id: string) => {
        const newOptions = [...optionsInput.value]
        const index = newOptions.findIndex((s) => s.id === id)
        newOptions[index].deleted = true
        optionsInput.onChange(newOptions)
    }

    const undoDelete = (id: string) => {
        const newOptions = [...optionsInput.value]
        const index = newOptions.findIndex((s) => s.id === id)
        delete newOptions[index]?.deleted
        optionsInput.onChange(newOptions)
    }

    const filteredOptions = filter
        ? optionsInput.value.filter((o: Option) => {
              const lowerCaseFilter = filter.toLowerCase()
              if (
                  optionsDetails[o.id].code
                      .toLowerCase()
                      .includes(lowerCaseFilter) ||
                  optionsDetails[o.id].name
                      .toLowerCase()
                      .includes(lowerCaseFilter)
              ) {
                  return true
              }
          })
        : [...optionsInput.value]

    const totalLength = filteredOptions.length
    const totalPageCount = Math.ceil(filteredOptions.length / pageSize)

    const displayOptions = filteredOptions.splice(
        (pageCount - 1) * pageSize,
        pageCount * pageSize
    )

    if (optionsInput.value.length === 0) {
        return <NoticeBox>{i18n.t('No options have been added yet')}</NoticeBox>
    }

    return (
        <>
            <FilterWarning
                filter={filter}
                hiddenRowsCount={
                    optionsInput.value.length - filteredOptions.length
                }
            />
            <DataTable>
                <TableHeadLayout />
                <TableBody>
                    {displayOptions?.map((option: Option, index: number) => (
                        <OptionRow
                            key={option.id}
                            deleted={!!option.deleted}
                            optionDetail={optionsDetails[option.id]}
                            disableManualSort={!!filter}
                            totalLength={totalLength}
                            index={index + pageSize * (pageCount - 1)}
                            undoDelete={undoDelete}
                            onDelete={onDelete}
                            onMove={onMove}
                            setTranslationDialogModelID={
                                setTranslationDialogModelID
                            }
                        />
                    ))}
                </TableBody>
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
            {translationDialogModelID && (
                <TranslationDialog
                    model={optionsDetails[translationDialogModelID]}
                    onClose={() => {
                        setTranslationDialogModelID(undefined)
                    }}
                    schemaName={SchemaName.option}
                />
            )}
        </>
    )
}

const OptionsListUnSortableSetup = ({
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
        <OptionsListUnSortable
            modelId={modelId}
            optionsCount={optionsCount}
            manuallyDeleted={manuallyDeleted}
        />
    )
}

const OptionsListUnSortable = ({
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
        return <ErrorNotice />
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
                        'Sort functionality is not available with more than 50 options'
                    )}
                </NoticeBox>
            </div>
            <DataTable>
                <TableHeadLayout />
                {!data ? (
                    <DataTableCell colSpan="100%">
                        <div className={css.optionsLoadingDiv}>
                            <CircularLoader small />
                        </div>
                    </DataTableCell>
                ) : (
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

const OptionSetFormFields = ({
    manuallyDeleted,
}: {
    manuallyDeleted: string
}) => {
    return (
        <>
            <OptionListNewOrEdit manuallyDeleted={manuallyDeleted} />
        </>
    )
}

export default OptionSetFormFields
