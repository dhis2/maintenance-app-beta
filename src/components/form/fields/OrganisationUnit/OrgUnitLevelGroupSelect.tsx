import i18n from '@dhis2/d2-i18n'
import {
    DropdownButton,
    FlyoutMenu,
    Input,
    MenuDivider,
    MenuItem,
} from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import {
    useDebouncedState,
    usePaginatedModelQuery,
    useBoundResourceQueryFn,
} from '../../../../lib'
import { PlainResourceQuery } from '../../../../types'
import {
    OrganisationUnitGroup,
    OrganisationUnitLevel,
} from '../../../../types/generated'
import { ErrorRetry } from '../../../error'
import { LoadingSpinner } from '../../../loading/LoadingSpinner'
import css from './OrgUnitLevelGroupSelect.module.css'

export type OrgUnitLevelGroupSelectProps = {
    onLevelSelect: (level: PartialOrganisationUnitLevel) => void
    onGroupSelect: (group: PartialOrganisationUnitGroup) => void
    onLevelDeselect: (level: PartialOrganisationUnitLevel) => void
    onGroupDeselect: (group: PartialOrganisationUnitGroup) => void
    onDeselectAll?: () => void
    minlevel?: number
}
export const OrgUnitLevelGroupSelect = ({
    onLevelSelect,
    onGroupSelect,
    onLevelDeselect,
    onGroupDeselect,
    onDeselectAll,
    minlevel,
}: OrgUnitLevelGroupSelectProps) => {
    const [open, setOpen] = useState(false)

    const withClose =
        <T extends (...args: Parameters<T>) => ReturnType<T>>(fn: T) =>
        (...args: Parameters<T>) => {
            setOpen(false)
            return fn(...args)
        }

    return (
        <DropdownButton
            secondary
            small
            open={open}
            onClick={() => setOpen(!open)}
            component={
                <FlyoutMenu dense>
                    <MenuItem label={i18n.t('Select by level')}>
                        <LevelSelect
                            onSelect={withClose(onLevelSelect)}
                            minLevel={minlevel}
                        />
                    </MenuItem>
                    <MenuItem label={i18n.t('Select by group')}>
                        <GroupSelect onSelect={withClose(onGroupSelect)} />
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem label={i18n.t('Deselect by level')}>
                        <LevelSelect
                            onSelect={withClose(onLevelDeselect)}
                            minLevel={minlevel}
                        />
                    </MenuItem>
                    <MenuItem label={i18n.t('Deselect by group')}>
                        <GroupSelect onSelect={withClose(onGroupDeselect)} />
                    </MenuItem>
                    <MenuDivider />
                    {onDeselectAll && (
                        <MenuItem
                            label={i18n.t('Deselect all')}
                            onClick={withClose(onDeselectAll)}
                        />
                    )}
                </FlyoutMenu>
            }
        >
            {i18n.t('Select/deselect by group or level')}
        </DropdownButton>
    )
}

const ORGUNIT_LEVEL_QUERY = {
    resource: 'filledOrganisationUnitLevels',
    params: {
        fields: ['displayName', 'level'],
    },
} as const satisfies PlainResourceQuery
type LevelFields = (typeof ORGUNIT_LEVEL_QUERY)['params']['fields'][number]
type PartialOrganisationUnitLevel = Pick<OrganisationUnitLevel, LevelFields>

type LevelSelectProps = {
    onSelect: (level: PartialOrganisationUnitLevel) => void
    minLevel?: number
}
export const LevelSelect = ({ onSelect, minLevel }: LevelSelectProps) => {
    const queryFn = useBoundResourceQueryFn()
    const queryResult = useQuery({
        queryKey: [ORGUNIT_LEVEL_QUERY],
        queryFn: queryFn<Array<PartialOrganisationUnitLevel>>,
        staleTime: 60 * 1000,
    })

    if (queryResult.isLoading) {
        return <LoadingSpinner />
    }

    if (queryResult.isError) {
        return (
            <ErrorRetry
                error={queryResult.error}
                onRetryClick={queryResult.refetch}
            />
        )
    }

    return (
        <div>
            {queryResult.data
                ?.filter((level) => level.level >= (minLevel ?? 1))
                .map((level) => (
                    <MenuItem
                        key={level.level}
                        label={level.displayName}
                        onClick={() => onSelect(level)}
                    />
                ))}
        </div>
    )
}

const ORGUNIT_GROUP_QUERY = {
    resource: 'organisationUnitGroups',
    params: {
        fields: ['id', 'displayName'],
    },
} as const satisfies PlainResourceQuery

type GroupFields = (typeof ORGUNIT_GROUP_QUERY)['params']['fields'][number]
type PartialOrganisationUnitGroup = Pick<OrganisationUnitGroup, GroupFields>

export type GroupSelectProps = {
    onSelect: (group: PartialOrganisationUnitGroup) => void
}
export const GroupSelect = ({ onSelect }: GroupSelectProps) => {
    const [search, setSearch] = useState('')
    const queryResult = usePaginatedModelQuery<
        Pick<OrganisationUnitGroup, GroupFields>
    >({
        search,
        query: ORGUNIT_GROUP_QUERY,
    })
    const items = queryResult.allData

    return (
        <FilterableMenuItems
            onFilterChange={setSearch}
            hasNextPage={queryResult.hasNextPage}
            onEndReached={() =>
                queryResult.isSuccess && queryResult.fetchNextPage()
            }
            loading={queryResult.isLoading}
        >
            {queryResult.isError && (
                <ErrorRetry
                    error={queryResult.error}
                    onRetryClick={queryResult.refetch}
                />
            )}
            {items.map((group) => (
                <MenuItem
                    key={group.id}
                    label={group.displayName}
                    onClick={() => onSelect(group)}
                />
            ))}
        </FilterableMenuItems>
    )
}

export type FilterableMenuItemsProps = {
    placeholder?: string
    /**
     * Callback for when the filter value changes, debounced
     */
    onFilterChange?: (value: string) => void
    onEndReached?: () => void
    hasNextPage?: boolean
    loading?: boolean
}

export const FilterableMenuItems = ({
    placeholder,
    onEndReached,
    hasNextPage,
    loading,
    onFilterChange,
    children,
}: PropsWithChildren<FilterableMenuItemsProps>) => {
    const spinnerRef = useRef<HTMLDivElement>(null)
    const { liveValue: search, setValue: setSearch } = useDebouncedState({
        onSetDebouncedValue: (value) => onFilterChange?.(value.trim()),
        initialValue: '',
        delay: 250,
    })
    useEffect(() => {
        if (!loading && spinnerRef.current) {
            const observer = new IntersectionObserver(
                (entries) => {
                    const [{ isIntersecting }] = entries

                    if (isIntersecting) {
                        onEndReached?.()
                    }
                },
                { threshold: 0.8 }
            )

            observer.observe(spinnerRef.current as HTMLElement)
            return () => observer.disconnect()
        }
    }, [loading, onEndReached])

    return (
        <div className={css.filterableMenuItems}>
            <div role="menuitem" className={css.searchWrapper} tabIndex={-1}>
                <Input
                    dense
                    value={search}
                    onChange={({ value }) => setSearch(value ?? '')}
                    placeholder={placeholder ?? i18n.t('Search')}
                    clearable
                />
            </div>
            {children}
            {(hasNextPage || loading) && (
                <div ref={spinnerRef}>
                    <LoadingSpinner />
                </div>
            )}
        </div>
    )
}
