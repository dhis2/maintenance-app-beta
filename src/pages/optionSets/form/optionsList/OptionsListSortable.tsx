import { useDataEngine } from '@dhis2/app-runtime'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { OptionsErrorNotice } from './OptionsErrorNotice'
import { OptionsListTable } from './OptionsListTable'

export const OptionsListSortable = ({ modelId }: { modelId: string }) => {
    const engine = useDataEngine()
    const query = {
        result: {
            resource: `optionSets/${modelId}`,
            params: {
                fields: 'options[id]',
            },
        },
    }

    const { error, data } = useQuery({
        queryKey: [query],
        queryFn: ({ queryKey: [query], signal }) => {
            return engine.query(query, { signal }) as Promise<{
                result: { options: { id: string }[] }
            }>
        },
    })
    if (error) {
        return <OptionsErrorNotice />
    }
    if (!data) {
        return null
    }
    const options = data?.result?.options ?? []

    return (
        <OptionsListTable
            modelId={modelId}
            options={options}
        ></OptionsListTable>
    )
}
