import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import { AccordionSection } from '../../../components/accordion/AccordionSection'
import { Input } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import styles from './NumeratorExpressionSidebar.module.css'
import memoize from 'lodash/memoize'
import { useDebouncedCallback } from 'use-debounce'

interface DataItem {
    id: string
    displayName: string
}

interface Pager {
    page: number
    pageCount: number
    pageSize: number
    total: number
}

interface QueryResponse {
    [resourceKey: string]: DataItem[]
    pager?: Pager
}

interface DefaultExpressionSectionProps {
    id: string
    title: string
    resource: string
    onInsert: (value: string) => void
    isOpen: boolean
    onToggle: () => void
    filterKey?: string
    paginate?: boolean
    staticFilters?: string[]
    fields?: string[]
    pageSize?: number
}

export function DefaultExpressionSection({
    id,
    title,
    resource,
    onInsert,
    isOpen,
    onToggle,
    filterKey = 'displayName',
    paginate = false,
    staticFilters = [],
    fields = ['id', 'displayName'],
    pageSize = 50
}: DefaultExpressionSectionProps) {
    const [filterValue, setFilterValue] = useState<string>('')
    const [page, setPage] = useState<number>(1)

    const query = {
        data: {
            resource,
            params: ({ pageVar, filterVal }) => {
                console.log('Fetching page', pageVar, 'with filter', filterVal)
                return {
                    fields: fields.join(','),
                    filter: [
                        ...staticFilters,
                        ...(filterVal.trim() ? [`${filterKey}:ilike:${filterVal.trim()}`] : [])
                    ],
                    paging: paginate,
                    page: pageVar,
                    pageSize,
                    totals: paginate
                }
            }
        }
    }

    const { loading, error, data, refetch } = useDataQuery<{ data: QueryResponse }>(query)


    const memoizedRefetch = useMemo(
        () =>
            memoize((pageVar: number, filterVal: string) =>
                refetch({ pageVar, filterVal })
            ),
        [refetch]
    )

    const debouncedFetch = useDebouncedCallback(
        (p: number, f: string) => memoizedRefetch(p, f),
        200,
        { leading: true }
    )

    useEffect(() => {
        debouncedFetch(page, filterValue)
    }, [page, filterValue, debouncedFetch])

    const items: DataItem[] = data?.data?.[resource] || []
    const pager: Pager | undefined = data?.data?.pager

    const handleFilterChange = ({ value }: { value?: string }) => {
        setPage(1)
        setFilterValue(value || '')
    }

    const handleItemClick = (item: DataItem) => {
        onInsert(item.displayName)
    }

    const goToPrevPage = () => {
        if (page > 1) setPage((p) => p - 1)
    }

    const goToNextPage = () => {
        if (pager && page < pager.pageCount) setPage((p) => p + 1)
    }

    return (
        <AccordionSection
            id={id}
            title={title}
            isOpen={isOpen}
            onToggle={onToggle}
            loading={loading}
        >
            <div className={styles.filterContainer}>
                <Input
                    placeholder={i18n.t('Filter {{title}}', { title: title.toLowerCase() })}
                    value={filterValue}
                    onChange={handleFilterChange}
                    dense
                    disabled={loading}
                />
            </div>

            {error && (
                <div className={styles.errorMessage}>
                    {i18n.t('Failed to load data')}
                    <button onClick={() => refetch({ pageVar: page, filterVal: filterValue })} type="button">
                        {i18n.t('Retry')}
                    </button>
                </div>
            )}

            {!loading && !error && items.length === 0 && (
                <div className={styles.emptyMessage}>
                    {filterValue.trim()
                        ? i18n.t('No items match "{{filter}}"', { filter: filterValue.trim() })
                        : i18n.t('No items found')}
                </div>
            )}

            {!error && items.length > 0 && (
                <>
                    <ul className={styles.itemList}>
                        {items.map((item) => (
                            <li key={item.id}>
                                <button
                                    className={styles.accordionItem}
                                    onClick={() => handleItemClick(item)}
                                    disabled={loading}
                                    type="button"
                                    title={item.displayName}
                                >
                                    {item.displayName}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {paginate && pager ? (
                        <div className={styles.resultsInfo}>
                            {i18n.t('{{start}}-{{end}} of {{total}} items', {
                                start: Math.min((page - 1) * pageSize + 1, pager.total),
                                end: Math.min(page * pageSize, pager.total),
                                total: pager.total
                            })}
                        </div>
                    ) : (
                        <div className={styles.resultsInfo}>
                            {i18n.t('{{count}} items', { count: items.length })}
                        </div>
                    )}
                </>
            )}

            {paginate && pager && pager.pageCount > 1 && !loading && (
                <div className={styles.paginationControls}>
                    <button disabled={page <= 1} onClick={goToPrevPage} type="button">
                        {i18n.t('Previous')}
                    </button>
                    <span>
                        {i18n.t('Page {{current}} of {{total}}', {
                            current: page,
                            total: pager.pageCount
                        })}
                    </span>
                    <button disabled={page >= pager.pageCount} onClick={goToNextPage} type="button">
                        {i18n.t('Next')}
                    </button>
                </div>
            )}
        </AccordionSection>
    )
}
