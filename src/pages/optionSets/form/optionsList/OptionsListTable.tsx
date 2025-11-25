import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
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
    Input,
    NoticeBox,
} from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useMemo, useState } from 'react'
import { useField } from 'react-final-form'
import {
    MoreDropdownButton,
    MoreDropdownItem,
    MoreDropdownDivider,
} from '../../../../components'
import { TranslationDialog } from '../../../../components/sectionList/translation'
import { SchemaName } from '../../../../lib'
import css from './OptionList.module.css'
import { Option, OptionDetail, OptionsDetails } from './optionsConstants'
import { OptionsErrorNotice } from './OptionsErrorNotice'

export const OptionsListTable = ({
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
        return <OptionsErrorNotice />
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

export const TableHeadLayout = () => (
    <TableHead>
        <DataTableRow>
            <DataTableColumnHeader>{i18n.t('Name')}</DataTableColumnHeader>
            <DataTableColumnHeader>{i18n.t('Code')}</DataTableColumnHeader>
            <DataTableColumnHeader> </DataTableColumnHeader>
        </DataTableRow>
    </TableHead>
)

export const FilterAndSort = ({
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

export const FilterWarning = ({
    filter,
    hiddenRowsCount,
}: {
    filter: string | undefined
    hiddenRowsCount: number
}) => {
    if (!filter || Number.isNaN(hiddenRowsCount)) {
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

export const OptionRow = ({
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
        pageSize
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
