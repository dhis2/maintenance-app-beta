import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React, { useRef } from 'react'
import { Schema, useSchemaFromHandle } from '../../../lib'
import { Query, WrapQueryResponse } from '../../../types'
import { BaseIdentifiableObject } from '../../../types/models'
import { ClientDateTime } from '../../date'
import { Loader } from '../../loading'
import { ApiUrlValue, DetailItem } from './DetailItem'
import { DetailsPanelContent } from './DetailsPanel'

type DetailsPanelProps = {
    modelId: string
}

const defaultQueryFields = [
    'code',
    'created',
    'lastUpdated',
    'displayName',
    'id',
    'shortName',
    'href',
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
            fields: defaultQueryFields.filter(
                (field) => !!schemaProperties[field]
            ),
        },
    },
})

// fields that are not in BaseIdentifiableObject
type ExtraFields = {
    shortName?: string
}

type DetailsResponse = Pick<
    BaseIdentifiableObject & ExtraFields, //Record<string, unknown>,
    (typeof defaultQueryFields)[number]
>

export const DefaultDetailsPanelContent = ({ modelId }: DetailsPanelProps) => {
    const schema = useSchemaFromHandle()
    // used to prevent changing query after initial render
    const queryRef = useRef(
        createDefaultDetailsQuery(schema.plural, modelId, schema.properties)
    )

    const detailsQueryResponse = useDataQuery<
        WrapQueryResponse<DetailsResponse, 'result'>
    >(queryRef.current)
    return (
        <Loader queryResponse={detailsQueryResponse}>
            <DetailsContent
                data={
                    detailsQueryResponse.data
                        ?.result as NonNullable<DetailsResponse>
                }
            />
        </Loader>
    )
}

const DetailsContent = ({ data }: { data: DetailsResponse }) => {
    return (
        <DetailsPanelContent displayName={data.displayName} modelId={data.id}>
            {data.shortName && (
                <DetailItem label={i18n.t('Short name')}>
                    {data.shortName}
                </DetailItem>
            )}
            <DetailItem label={i18n.t('Code')}>{data.code}</DetailItem>
            <DetailItem label={i18n.t('Created')}>
                <ClientDateTime value={data.created} />
            </DetailItem>
            <DetailItem label={i18n.t('Last updated')}>
                <ClientDateTime value={data.created} />
            </DetailItem>
            <DetailItem label={i18n.t('Id')}>{data.id}</DetailItem>
            <DetailItem label={i18n.t('API URL')}>
                <ApiUrlValue value={data.href} />
            </DetailItem>
        </DetailsPanelContent>
    )
}
