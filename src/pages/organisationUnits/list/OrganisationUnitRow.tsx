import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Checkbox,
    DataTableCell,
    DataTableRow,
    IconArrowDown16,
    IconArrowUp16,
    IconChevronDown16,
    IconChevronRight16,
} from '@dhis2/ui'
import { flexRender, Row } from '@tanstack/react-table'
import React from 'react'
import { BaseListModel } from '../../../lib'
import type { OrganisationUnitListItem } from './OrganisationUnitList'
import css from './OrganisationUnitList.module.css'
import { OrganisationUnitListActions } from './OrganisationUnitListActions'

export const OrganisationUnitRow = ({
    row,
    toggleShowAll,
    showAllActive,
    isFiltering,
    fetchNextPage,
    onShowDetailsClick,
}: {
    row: Row<OrganisationUnitListItem>
    toggleShowAll: (id: string) => void
    showAllActive: boolean
    isFiltering: boolean
    fetchNextPage: (id: string) => void
    onShowDetailsClick: (model: BaseListModel) => void
}) => {
    const parentRow = row.getParentRow()

    return (
        <>
            <DataTableRow key={row.id}>
                <DataTableCell>
                    <span
                        style={{
                            paddingLeft: `${row.depth * 2}rem`,
                            display: 'flex',
                        }}
                    >
                        {row.getCanExpand() ? (
                            <>
                                {isFiltering &&
                                    (showAllActive ||
                                        row.original.childCount !==
                                            row.subRows.length) && (
                                        <Button
                                            secondary
                                            onClick={() => {
                                                toggleShowAll(row.original.id)
                                            }}
                                            icon={
                                                showAllActive ? (
                                                    <IconArrowUp16 />
                                                ) : (
                                                    <IconArrowDown16 />
                                                )
                                            }
                                        >
                                            Show all
                                        </Button>
                                    )}
                                <Button
                                    className={css.expandButton}
                                    secondary
                                    type="button"
                                    dataTest="row-expand-icon"
                                    loading={
                                        row.getIsExpanded() &&
                                        row.subRows.length < 1
                                    }
                                    icon={
                                        row.getIsExpanded() ? (
                                            <IconChevronDown16 />
                                        ) : (
                                            <IconChevronRight16 />
                                        )
                                    }
                                    onClick={row.getToggleExpandedHandler()}
                                ></Button>
                            </>
                        ) : null}
                        <Checkbox
                            checked={row.getIsSelected()}
                            onChange={({ checked }) =>
                                row.toggleSelected(checked)
                            }
                        />
                    </span>
                </DataTableCell>
                {row.getVisibleCells().map((cell) => {
                    return (
                        <DataTableCell key={cell.id}>
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}
                        </DataTableCell>
                    )
                })}
                <DataTableCell>
                    <OrganisationUnitListActions
                        model={row.original}
                        onShowDetailsClick={onShowDetailsClick}
                        // onOpenTranslationClick={()=>{}}
                    />
                </DataTableCell>
            </DataTableRow>
            {!isFiltering &&
                parentRow &&
                parentRow.getIsExpanded() &&
                parentRow.subRows.length < parentRow?.original.childCount &&
                row === parentRow.subRows[parentRow.subRows.length - 1] && (
                    <DataTableRow>
                        <DataTableCell
                            colSpan="100"
                            style={{ textAlign: 'center' }}
                            onClick={() => fetchNextPage(parentRow.original.id)}
                        >
                            {i18n.t('Load more for {{orgUnitName}}', {
                                orgUnitName: parentRow.original.displayName,
                            })}
                        </DataTableCell>
                    </DataTableRow>
                )}
        </>
    )
}
