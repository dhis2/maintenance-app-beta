import i18n from '@dhis2/d2-i18n'
import {
    InputField,
    OrganisationUnitEventPayload,
    OrganisationUnitTree,
    OrganisationUnitTreeProps,
} from '@dhis2/ui'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { Field } from 'react-final-form'
import { useCurrentUserRootOrgUnits, useDebouncedState } from '../../../../lib'
import { useBoundResourceQueryFn } from '../../../../lib/query/useBoundQueryFn'
import { Optional, PagedResponse, PlainResourceQuery } from '../../../../types'
import { OrganisationUnit } from '../../../../types/generated'
import { OrganisationUnitSelectedList } from './OrganisationUnitSelectedList'
import css from './OrganisationUnitTreeWithToolbar.module.css'
import {
    OrgUnitLevelGroupSelect,
    OrgUnitLevelGroupSelectProps,
} from './OrgUnitLevelGroupSelect'

export type SearchOrganisationUnitResponse = PagedResponse<
    Pick<OrganisationUnit, 'path'>,
    'organisationUnits'
>

export type OrganisationUnitValue = {
    id?: string
    path: string
    displayName: string
}

export type OrganisationUnitFieldProps = Optional<
    Omit<OrganisationUnitTreeProps, 'onChange' | 'selected'>,
    'roots'
> & {
    onChange: (value: OrganisationUnitValue[]) => void
    selected: OrganisationUnitValue[] | undefined
}

export const OrganisationUnitTreeWithToolbar = ({
    selected,
    onChange,
    ...treeProps
}: OrganisationUnitFieldProps) => {
    const queryClient = useQueryClient()
    const boundQueryFn = useBoundResourceQueryFn()
    const {
        debouncedValue: debouncedSearch,
        liveValue: search,
        setValue: setSearchValue,
    } = useDebouncedState({
        initialValue: '',
        delay: 250,
    })
    const roots = useCurrentUserRootOrgUnits()

    const isFiltered = debouncedSearch !== ''
    const matchingSearchUnits = useQuery({
        queryFn: boundQueryFn<SearchOrganisationUnitResponse>,
        enabled: isFiltered,
        queryKey: [
            {
                resource: 'organisationUnits',
                params: {
                    filter: `identifiable:token:${debouncedSearch}`,
                    fields: ['path'],
                    withinUserHierarchy: true,
                    pageSize: 50,
                },
            } satisfies PlainResourceQuery,
        ],
    })
    const searchUnits =
        matchingSearchUnits.data?.organisationUnits.map((ou) => ou.path) ?? []

    const rootIds = roots.map((ou) => ou.id)

    const selectedPaths = selected?.map((ou) => ou.path) || []
    const handleChange = ({
        selected: newSelectedPaths,
        displayName,
        id,
        path,
    }: OrganisationUnitEventPayload) => {
        const prevSelectedMap = selected
            ? new Map(selected?.map((ou) => [ou.path, ou]))
            : new Map()

        const newSelected = newSelectedPaths.map((selectedPath) => {
            const prev = prevSelectedMap.get(selectedPath)
            return prev ?? { id, path, displayName }
        })

        onChange(newSelected)
    }

    const handleLevelSelect: OrgUnitLevelGroupSelectProps['onLevelSelect'] =
        async (level) => {
            const orgUnits = await queryClient.fetchQuery({
                queryFn: boundQueryFn<{
                    organisationUnits: OrganisationUnitValue[]
                }>,
                queryKey: [
                    {
                        resource: 'organisationUnits',
                        params: {
                            fields: ['path', 'displayName'],
                            filter: [`level:eq:${level.level}`],
                            paging: false,
                        },
                    },
                ],
            })
            const allNewSelected = selected?.concat(orgUnits.organisationUnits)
            if (allNewSelected) {
                onChange(allNewSelected)
            }
        }

    const handleGroupSelect: OrgUnitLevelGroupSelectProps['onGroupSelect'] =
        async (group) => {
            const orgUnits = await queryClient.fetchQuery({
                queryFn: boundQueryFn<{
                    organisationUnits: OrganisationUnitValue[]
                }>,
                queryKey: [
                    {
                        resource: 'organisationUnits',
                        params: {
                            fields: ['path', 'displayName'],
                            filter: [
                                `organisationUnitGroups.id:eq:${group.id}`,
                            ],
                            paging: false,
                        },
                    },
                ],
            })
            const allNewSelected = selected?.concat(orgUnits.organisationUnits)
            if (allNewSelected) {
                onChange(allNewSelected)
            }
        }

    return (
        <div className={css.wrapper}>
            <OrganisationUnitTreeToolbar
                onSearchChange={setSearchValue}
                searchValue={search}
                onGroupSelect={handleGroupSelect}
                onLevelSelect={handleLevelSelect}
            />
            {matchingSearchUnits.data?.pager.total === 0 && (
                <p>No organisation units match your search.</p>
            )}
            {matchingSearchUnits.data?.pager.nextPage && (
                <p>
                    There are more results than are displayed. Please narrow
                    down the search.
                </p>
            )}
            <div className={css.treeWrapper}>
                {
                    <OrganisationUnitTree
                        roots={rootIds}
                        initiallyExpanded={rootIds}
                        filter={searchUnits}
                        selected={selectedPaths}
                        onChange={handleChange}
                        {...treeProps}
                    />
                }
            </div>
        </div>
    )
}

type OrganisationUnitTreeToolbarProps = {
    searchValue: string | undefined
    onSearchChange: (search: string) => void
    onGroupSelect: OrgUnitLevelGroupSelectProps['onGroupSelect']
    onLevelSelect: OrgUnitLevelGroupSelectProps['onLevelSelect']
}
const OrganisationUnitTreeToolbar = ({
    onSearchChange,
    searchValue,
    onGroupSelect,
    onLevelSelect,
}: OrganisationUnitTreeToolbarProps) => {
    return (
        <div className={css.toolbarWrapper}>
            <InputField
                className={css.searchField}
                placeholder={i18n.t('Search for organisation units')}
                value={searchValue}
                onChange={(payload) => {
                    onSearchChange(payload.value ?? '')
                }}
                clearable
                dense
            />
            <OrgUnitLevelGroupSelect
                onGroupSelect={onGroupSelect}
                onLevelSelect={onLevelSelect}
            />
        </div>
    )
}

export const OrganisationUnitTreeWithToolbarFormField = () => {
    return (
        <Field<OrganisationUnitValue[]>
            name="organisationUnits"
            render={(renderProps) => (
                <div className={css.treeSelectedListWrapper}>
                    <OrganisationUnitTreeWithToolbar
                        onChange={(value) => {
                            renderProps.input.onChange(value)
                            renderProps.input.onBlur()
                        }}
                        selected={renderProps.input.value}
                    />
                    <OrganisationUnitSelectedList
                        selected={renderProps.input.value}
                    />
                </div>
            )}
            format={(p) => p ?? []}
        />
    )
}
