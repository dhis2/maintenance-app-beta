import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { MAXIMUM_OPTIONS } from './optionsConstants'
import { OptionsListSortable } from './OptionsListSortable'
import { OptionsListUnSortable } from './OptionsListUnsortable'

export const OptionListNewOrEdit = ({
    manuallyDeleted,
}: {
    manuallyDeleted: string
}) => {
    const modelId = useParams().id as string
    // options cannot be added until option set is saved
    if (!modelId) {
        return (
            <NoticeBox>
                {i18n.t('Option set must be saved before options can be added')}
            </NoticeBox>
        )
    }
    return (
        <OptionsListSizeCheck
            modelId={modelId}
            manuallyDeleted={manuallyDeleted}
        />
    )
    // if edit mode, check count of options
}

const ErrorNotice = () => (
    <NoticeBox error>
        {i18n.t('Something went wrong when loading options')}
    </NoticeBox>
)

// check if there are MAXIMUM_OPTIONS or fewer option
const OptionsListSizeCheck = ({
    modelId,
    manuallyDeleted,
}: {
    modelId: string
    manuallyDeleted: string
}) => {
    const engine = useDataEngine()
    const query = {
        result: {
            resource: `optionSets/${modelId}`,
            params: {
                fields: 'options~size',
            },
        },
    }
    const { error, data } = useQuery({
        queryKey: [query],
        queryFn: ({ queryKey: [query], signal }) => {
            return engine.query(query, { signal }) as Promise<{
                result: { options: number }
            }>
        },
    })
    if (error) {
        return <ErrorNotice />
    }
    if (!data) {
        return null
    }
    if (data?.result?.options > MAXIMUM_OPTIONS) {
        return (
            <OptionsListUnSortable
                modelId={modelId}
                optionsCount={data.result.options}
                initialOptions={[]}
                manuallyDeleted={manuallyDeleted}
            />
        )
    }
    return <OptionsListSortable modelId={modelId} />
}
