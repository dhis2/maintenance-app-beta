import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React, { useRef } from 'react'
import {
    canEditModel,
    isNonSchemaSection,
    Schema,
    useSchemaFromHandle,
} from '../../../lib'
import { Query, WrapQueryResponse } from '../../../types'
import { BaseIdentifiableObject } from '../../../types/models'
import { ClientDateTime } from '../../date'
import { Loader } from '../../loading'
import { ApiUrlValue, DetailItem } from './DetailItem'
import {
    DetailsList,
    DetailsPanelButtons,
    DetailsPanelContent,
} from './DetailsPanel'

type DetailsPanelProps = {
    modelId: string
}

const defaultQueryFields = [
    'access',
    'code',
    'created',
    'lastUpdated',
    'lastUpdatedBy',
    'displayName',
    'id',
    'displayShortName',
    'href',
    'createdBy',
] as const

const createDefaultDetailsQuery = (
    resource: string,
    id: string,
    schemaProperties: Schema['properties']
): Query => ({
    result: {
        resource,
        id,
        params: {
            fields: defaultQueryFields
                .filter((field) => !!schemaProperties[field])
                .concat('id'),
        },
    },
})

type ExtraFields = {
    displayShortName?: string
}

type DetailsResponse = Pick<
    BaseIdentifiableObject & ExtraFields,
    (typeof defaultQueryFields)[number]
>

export const DefaultDetailsPanelContent = ({ modelId }: DetailsPanelProps) => {
    const schema = useSchemaFromHandle()

    const queryRef = useRef(
        createDefaultDetailsQuery(schema.plural, modelId, schema.properties)
    )

    const detailsQueryResponse = useDataQuery<
        WrapQueryResponse<DetailsResponse, 'result'>
    >(queryRef.current)

    const rawData = detailsQueryResponse.data?.result

    const detailsData: DetailsResponse | undefined = isNonSchemaSection({
        name: schema.name,
    } as any)
        ? Array.isArray(rawData)
            ? rawData[0]
            : rawData
        : (rawData as DetailsResponse)

    return (
        <Loader queryResponse={detailsQueryResponse}>
            {detailsData ? (
                <DetailsContent data={detailsData} />
            ) : (
                <div>{i18n.t('No details available')}</div>
            )}
        </Loader>
    )
}

const DetailsContent = ({ data }: { data: DetailsResponse }) => {
    const canEdit = data.access ? canEditModel(data) : false

    return (
        <DetailsPanelContent displayName={data.displayName}>
            <DetailsPanelButtons modelId={data.id} editable={canEdit} />
            <DetailsList>
                {data.displayShortName && (
                    <DetailItem label={i18n.t('Short name')}>
                        {data.displayShortName}
                    </DetailItem>
                )}
                <DetailItem label={i18n.t('Code')}>{data.code}</DetailItem>
                <DetailItem label={i18n.t('Created by')}>
                    {data.createdBy?.displayName}
                </DetailItem>
                <DetailItem label={i18n.t('Created')}>
                    <ClientDateTime value={data?.created} />
                </DetailItem>
                <DetailItem label={i18n.t('Last updated by')}>
                    {data.lastUpdatedBy?.displayName ??
                        data.createdBy?.displayName}
                </DetailItem>
                <DetailItem label={i18n.t('Last updated')}>
                    <ClientDateTime value={data.lastUpdated} />
                </DetailItem>
                <DetailItem label={i18n.t('Id')}>{data.id}</DetailItem>
                {data.href && (
                    <DetailItem label={i18n.t('API URL')}>
                        <ApiUrlValue value={data.href} />
                    </DetailItem>
                )}
            </DetailsList>
        </DetailsPanelContent>
    )
}
