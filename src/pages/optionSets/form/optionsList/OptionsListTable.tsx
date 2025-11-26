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
import React, { useCallback, useState } from 'react'
import { useField } from 'react-final-form'
import {
    MoreDropdownButton,
    MoreDropdownItem,
    MoreDropdownDivider,
} from '../../../../components'
import { TranslationDialog } from '../../../../components/sectionList/translation'
import { BaseListModel, SchemaName } from '../../../../lib'
import css from './OptionList.module.css'

type OptionDetail = BaseListModel & {
    name: string
    code: string
    deleted?: boolean
}

const SUGGESTED_MAXIMUM_OPTIONS = 500

const TableHeadLayout = () => (
    <TableHead>
        <DataTableRow>
            <DataTableColumnHeader>{i18n.t('Name')}</DataTableColumnHeader>
            <DataTableColumnHeader>{i18n.t('Code')}</DataTableColumnHeader>
            <DataTableColumnHeader> </DataTableColumnHeader>
        </DataTableRow>
    </TableHead>
)

const FilterAndSort = ({
    filterValue,
    setFilterValue,
    setPageCount,
    sortOptions,
    showEditWarning = false,
}: {
    filterValue: string | undefined
    setFilterValue: (s: string | undefined) => void
    setPageCount: (n: number) => void
    sortOptions: (property: string, desc: boolean) => void
    showEditWarning?: boolean
}) => (
    <>
        <div>
            <Input
                className={css.identifiableSelectionFilter}
                placeholder={i18n.t('Search by name or code')}
                onChange={(e) => {
                    setFilterValue(e.value)
                    setPageCount(1)
                }}
                value={filterValue}
                dense
            />
        </div>
        <div className={css.sortButtons}>
            <ButtonStrip>
                <Button>{i18n.t('Add option')}</Button>

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
        </div>
        {showEditWarning && (
            <div className={css.sortDisabledWarning}>
                <NoticeBox>
                    {i18n.t(
                        'Editing options may be slow with more than {{maximumNumberOfOptions}} options',
                        { maximumNumberOfOptions: SUGGESTED_MAXIMUM_OPTIONS }
                    )}
                </NoticeBox>
            </div>
        )}
    </>
)

const FilterWarning = ({
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

const OptionRow = ({
    deleted,
    option,
    totalLength,
    index,
    undoDelete,
    onDelete,
    onMove,
    setTranslationDialogModelID,
}: {
    deleted: boolean
    option: OptionDetail
    totalLength: number
    index: number
    undoDelete: (id: string) => void
    onDelete: (id: string) => void
    onMove: (id: string, moveIndexBy: number) => void
    setTranslationDialogModelID: (id: string) => void
}) => (
    <DataTableRow className={deleted ? css.deletedRow : ''} key={option.id}>
        <DataTableCell>{option?.name}</DataTableCell>
        <DataTableCell>{option?.code}</DataTableCell>
        <DataTableCell>
            <div className={css.actionButtons}>
                {deleted ? (
                    <div className={css.deletedOption}>
                        <span>{i18n.t('Will be removed on save')}</span>
                        <Button small onClick={() => undoDelete(option.id)}>
                            {i18n.t('Restore option')}
                        </Button>
                    </div>
                ) : (
                    <ButtonStrip>
                        <Button
                            small
                            className={css.wideButton}
                            secondary
                            icon={<IconArrowUp16 />}
                            onClick={() => onMove(option.id, -1)}
                            disabled={index === 0}
                        />
                        <Button
                            small
                            className={css.wideButton}
                            secondary
                            icon={<IconArrowDown16 />}
                            onClick={() => onMove(option.id, 1)}
                            disabled={index === totalLength - 1}
                        />

                        <Button
                            small
                            className={css.wideButton}
                            secondary
                            icon={<IconEdit16 />}
                        />
                        <MoreDropdownButton>
                            <MoreDropdownItem label={i18n.t('Edit')} />
                            {option.access !== undefined && (
                                <MoreDropdownItem
                                    label={i18n.t('Translate')}
                                    onClick={() => {
                                        setTranslationDialogModelID(option.id)
                                    }}
                                />
                            )}
                            <MoreDropdownDivider />
                            <MoreDropdownItem
                                label={i18n.t('Delete')}
                                destructive
                                onClick={() => onDelete(option.id)}
                            />
                        </MoreDropdownButton>
                    </ButtonStrip>
                )}
            </div>
        </DataTableCell>
    </DataTableRow>
)

export const OptionsListTable = () => {
    const [pageSize, setPageSize] = useState<number>(10)
    const [pageCount, setPageCount] = useState<number>(1)
    const { input: optionsInput } = useField('options')
    const [filter, setFilterValue] = useState<string | undefined>()

    const [translationDialogModelID, setTranslationDialogModelID] = useState<
        string | undefined
    >()

    const sortOptions = useCallback(
        (property: string, desc: boolean) => {
            const newOptionsOrder = [...optionsInput.value]
            if (desc) {
                newOptionsOrder.sort((a, b) =>
                    b[property].localeCompare(a[property], undefined, {
                        numeric: true,
                        sensitivity: 'base',
                    })
                )
            } else {
                newOptionsOrder.sort((a, b) =>
                    a[property].localeCompare(b[property], undefined, {
                        numeric: true,
                        sensitivity: 'base',
                    })
                )
            }
            optionsInput.onChange(newOptionsOrder)
            setPageCount(1)
        },
        [optionsInput, setPageCount]
    )

    const onMove = (id: string, moveIndexBy: number) => {
        const newOptionsOrder = [...optionsInput.value]
        const index = newOptionsOrder.findIndex((s) => s.id === id)
        const movedItem = newOptionsOrder[index]
        newOptionsOrder.splice(index, 1)
        newOptionsOrder.splice(index + moveIndexBy, 0, movedItem)
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
        ? optionsInput.value.filter((o: OptionDetail) => {
              const lowerCaseFilter = filter.toLowerCase()
              if (
                  o.code.toLowerCase().includes(lowerCaseFilter) ||
                  o.name.toLowerCase().includes(lowerCaseFilter)
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
        return (
            <>
                <NoticeBox className={css.noOptionsWarning}>
                    {i18n.t('No options have been added yet')}
                </NoticeBox>
                <div className={css.sortButtons}>
                    <ButtonStrip>
                        <Button>{i18n.t('Add option')}</Button>
                    </ButtonStrip>
                </div>
            </>
        )
    }

    return (
        <>
            <FilterAndSort
                filterValue={filter}
                setFilterValue={setFilterValue}
                setPageCount={setPageCount}
                sortOptions={sortOptions}
                showEditWarning={
                    optionsInput?.value?.length > SUGGESTED_MAXIMUM_OPTIONS
                }
            />
            <div>
                <FilterWarning
                    filter={filter}
                    hiddenRowsCount={optionsInput.value.length - totalLength}
                />
                <DataTable>
                    <TableHeadLayout />
                    <TableBody>
                        {displayOptions?.map(
                            (option: OptionDetail, index: number) => (
                                <OptionRow
                                    key={option.id}
                                    deleted={!!option.deleted}
                                    option={option}
                                    totalLength={totalLength}
                                    index={index + pageSize * (pageCount - 1)}
                                    undoDelete={undoDelete}
                                    onDelete={onDelete}
                                    onMove={onMove}
                                    setTranslationDialogModelID={
                                        setTranslationDialogModelID
                                    }
                                />
                            )
                        )}
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
                        model={optionsInput.value.find(
                            (o: OptionDetail) =>
                                o.id === translationDialogModelID
                        )}
                        onClose={() => {
                            setTranslationDialogModelID(undefined)
                        }}
                        schemaName={SchemaName.option}
                    />
                )}
            </div>
        </>
    )
}
