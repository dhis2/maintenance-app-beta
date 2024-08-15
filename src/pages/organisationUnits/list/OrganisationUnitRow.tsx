import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Checkbox,
    DataTableCell,
    DataTableRow,
    IconArrowDown16,
    IconChevronDown16,
    IconChevronRight16,
} from '@dhis2/ui'
import { ExpandedStateList, flexRender, Row } from '@tanstack/react-table'
import React from 'react'
import type { OrganisationUnitListItem } from './OrganisationUnitList'
import css from './OrganisationUnitList.module.css'

export const OrganisationUnitRow = ({
    row,
    setExpanded,
    isFiltering,
    fetchNextPage,
}: {
    row: Row<OrganisationUnitListItem>
    setExpanded: React.Dispatch<React.SetStateAction<ExpandedStateList>>
    isFiltering: boolean
    fetchNextPage: (id: string) => void
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
                                    row.original.childCount !==
                                        row.subRows.length && (
                                        <Button
                                            secondary
                                            onClick={() => {
                                                setExpanded((prev) => {
                                                    return {
                                                        ...prev,
                                                        [row.id]: prev[row.id]
                                                            ? !prev[row.id]
                                                            : true,
                                                    }
                                                })
                                            }}
                                            icon={<IconArrowDown16 />}
                                        >
                                            Show all
                                        </Button>
                                    )}
                                <Button
                                    className={css.expandButton}
                                    secondary
                                    type="button"
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
                    {/* <DefaultListActions
            model={row.original}
            onShowDetailsClick={() => undefined}
        /> */}
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
