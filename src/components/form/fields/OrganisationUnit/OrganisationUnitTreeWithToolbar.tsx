import i18n from '@dhis2/d2-i18n'
import {
    InputField,
    OrganisationUnitEventPayload,
    OrganisationUnitTree,
    OrganisationUnitTreeProps,
} from '@dhis2/ui'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Field } from 'react-final-form'
import { useCurrentUserRootOrgUnits, useDebouncedState } from '../../../../lib'
import { useBoundResourceQueryFn } from '../../../../lib/query/useBoundQueryFn'
import { uniqueBy } from '../../../../lib/utils'
import { Optional, PagedResponse, PlainResourceQuery } from '../../../../types'
import { OrganisationUnit } from '../../../../types/generated'
import { OrganisationUnitSelectedList } from './OrganisationUnitSelectedList'
import css from './OrganisationUnitTreeWithToolbar.module.css'
import {
    OrgUnitLevelGroupSelect,
    OrgUnitLevelGroupSelectProps,
} from './OrgUnitLevelGroupSelect'
import { FieldWrapper } from '../../helpers'

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
    const [search, setSearch] = useState('')
    const queryClient = useQueryClient()
    const boundQueryFn = useBoundResourceQueryFn()
    const roots = useCurrentUserRootOrgUnits()

    const isFiltered = search !== ''
    const matchingSearchUnits = useQuery({
        queryFn: boundQueryFn<SearchOrganisationUnitResponse>,
        enabled: isFiltered,
        queryKey: [
            {
                resource: 'organisationUnits',
                params: {
                    filter: `identifiable:token:${search}`,
                    fields: ['path'],
                    withinUserHierarchy: true,
                    pageSize: 150,
                },
            } satisfies PlainResourceQuery,
        ],
        keepPreviousData: true,
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
                            fields: ['id', 'path', 'displayName'],
                            filter: [`level:eq:${level.level}`],
                            paging: false,
                        },
                    },
                ],
            })
            const allNewSelected = selected?.concat(orgUnits.organisationUnits)
            if (allNewSelected) {
                onChange(uniqueBy(allNewSelected, (o) => o.path))
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
                            fields: ['id', 'path', 'displayName'],
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
                onChange(uniqueBy(allNewSelected, (o) => o.path))
            }
        }

    return (
        <div className={css.wrapper}>
            <OrganisationUnitTreeToolbar
                onSearchChange={setSearch}
                onGroupSelect={handleGroupSelect}
                onLevelSelect={handleLevelSelect}
            />
            <div className={css.treeMessage}>
                {matchingSearchUnits.data?.pager.total === 0 && (
                    <p>No organisation units match your search.</p>
                )}
                {matchingSearchUnits.data?.pager.nextPage && (
                    <p>
                        There are more results than are displayed. Please narrow
                        down the search.
                    </p>
                )}
            </div>

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
    onSearchChange: (search: string) => void
    onGroupSelect: OrgUnitLevelGroupSelectProps['onGroupSelect']
    onLevelSelect: OrgUnitLevelGroupSelectProps['onLevelSelect']
}
const OrganisationUnitTreeToolbar = ({
    onSearchChange,
    onGroupSelect,
    onLevelSelect,
}: OrganisationUnitTreeToolbarProps) => {
    const { liveValue: search, setValue: setSearchValue } = useDebouncedState({
        onSetDebouncedValue: onSearchChange,
        initialValue: '',
        delay: 250,
    })
    return (
        <div className={css.toolbarWrapper}>
            <InputField
                className={css.searchField}
                placeholder={i18n.t('Search for organisation units')}
                value={search}
                onChange={(payload) => {
                    setSearchValue(payload.value ?? '')
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

const OrganisationUnitTreeWithSelectedList = (
    props: OrganisationUnitFieldProps
) => {
    return (
        <div className={css.treeSelectedListWrapper}>
            <OrganisationUnitTreeWithToolbar {...props} />
            <OrganisationUnitSelectedList selected={props.selected} />
        </div>
    )
}

export const OrganisationUnitTreeWithToolbarFormField = ({
    name,
    label,
    ...treeProps
}: Omit<OrganisationUnitFieldProps, 'onChange' | 'selected'> & {
    name?: string
    label?: string
}) => {
    const resolvedName = name ?? 'organisationUnits'
    return (
        <Field<OrganisationUnitValue[]>
            name={resolvedName}
            render={(renderProps) => (
                <FieldWrapper
                    name={resolvedName}
                    meta={renderProps.meta}
                    label={label}
                >
                    <OrganisationUnitTreeWithSelectedList
                        {...treeProps}
                        onChange={(val) => {
                            renderProps.input.onChange(val)
                            renderProps.input.onBlur()
                        }}
                        selected={renderProps.input.value}
                    />
                </FieldWrapper>
            )}
            format={(p) => p ?? []}
        />
    )
}
