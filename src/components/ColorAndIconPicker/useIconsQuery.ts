import { useDataQuery } from '@dhis2/app-runtime'
import { useMemo } from 'react'
import { PagedResponse } from './../../types/generated/utility'
import { WrapQueryResponse } from './../../types/query'

export interface Icon {
    description: string
    href: string
    key: string
    keywords?: string[]
}

type IconsResponse = WrapQueryResponse<PagedResponse<Icon, 'icons'>>

const ICONS_QUERY = {
    result: {
        resource: 'icons',
    },
}

export function useIconsQuery() {
    const result = useDataQuery<IconsResponse>(ICONS_QUERY)
    const { data } = result
    const icons = useMemo(() => {
        if (!data) {
            return {
                all: [],
                positive: [],
                negative: [],
                outline: [],
            }
        }
        const { icons: unsortedIcons } = data.result
        const sortedIcons = unsortedIcons.sort(
            ({ key: left }, { key: right }) => left.localeCompare(right)
        )

        return {
            all: sortedIcons,
            positive: sortedIcons.filter((icon) =>
                icon.key.endsWith('_positive')
            ),
            negative: sortedIcons.filter((icon) =>
                icon.key.endsWith('_negative')
            ),
            outline: sortedIcons.filter((icon) =>
                icon.key.endsWith('_outline')
            ),
        }
    }, [data])

    return useMemo(
        () => ({
            ...result,
            data: icons,
        }),
        [result, icons]
    )
}
