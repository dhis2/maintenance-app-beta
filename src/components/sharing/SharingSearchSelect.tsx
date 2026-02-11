import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React, { useCallback, useMemo, useState } from 'react'
import { SearchableSingleSelect } from '../SearchableSingleSelect'

const query = {
    result: {
        resource: 'sharing/search',
        params: ({ searchFilter }: Record<string, string>) => ({
            key: searchFilter,
        }),
    },
}

type SharingUserResult = {
    id: string
    name: string
    displayName: string
    username: string
}

type SharingUserGroupResult = {
    id: string
    name: string
    displayName: string
}

export type SharingSearchResult =
    | (SharingUserResult & { entity: 'users' })
    | (SharingUserGroupResult & {
          entity: 'userGroups'
      })
    | { displayName: 'public'; id: 'public'; entity: 'public' }

type SharingSearchResponse = {
    result: {
        users: SharingUserResult[]
        userGroups: SharingUserGroupResult[]
    }
}

type SharingSearchSelectProps = {
    onChange: (value: SharingSearchResult) => void
}

export const SharingSearchSelect = ({ onChange }: SharingSearchSelectProps) => {
    const [selected, setSelected] = useState<string>('')

    const { data, refetch, error, loading } =
        useDataQuery<SharingSearchResponse>(query, {
            variables: { searchFilter: '' },
        })

    const formattedData = useMemo(() => {
        if (!data?.result) {
            return []
        }

        const users = data.result.users.map(
            (user) =>
                ({
                    ...user,
                    entity: 'users',
                    label: user.displayName,
                    value: user.id,
                } as const)
        )
        const userGroups = data.result.userGroups.map(
            (group) =>
                ({
                    ...group,
                    label: group.displayName,
                    entity: 'userGroups',
                    value: group.id,
                } as const)
        )

        return [...users, ...userGroups].sort((a, b) =>
            a.label.localeCompare(b.label)
        )
    }, [data])

    const handleChange = useCallback(
        ({ selected }: { selected: string }) => {
            if (formattedData.length < 1) {
                return
            }
            const selectedResult = formattedData.find(
                (res) => res.id === selected
            )

            if (selectedResult) {
                setSelected(selectedResult.id)
                onChange(selectedResult)
            }
        },
        [formattedData, setSelected, onChange]
    )

    const handleFetch = useCallback(
        ({ value }: { value: string }) => {
            refetch({ searchFilter: value.trim() })
        },
        [refetch]
    )

    return (
        <SearchableSingleSelect
            dense
            placeholder={i18n.t('Search for a user or group')}
            onFilterChange={handleFetch}
            selected={selected}
            options={formattedData}
            onChange={handleChange}
            onRetryClick={() => refetch()}
            loading={loading}
            showEndLoader={loading}
            error={error?.message}
            dataTest="sharing-search-select"
        />
    )
}
