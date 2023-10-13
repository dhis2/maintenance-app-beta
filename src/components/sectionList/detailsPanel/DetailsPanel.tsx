import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Card, IconCross24, Button, ButtonStrip } from '@dhis2/ui'
import React, { PropsWithChildren, useRef } from 'react'
import {
    getTranslatedProperty,
    useModelSectionHandleOrThrow,
} from '../../../lib'
import { Query, WrapQueryResponse } from '../../../types'
import { BaseIdentifiableObject } from '../../../types/models'
import { Loader } from '../../loading'
import { DetailItem } from './DetailItem'
import css from './DetailsPanel.module.css'

type DetailsPanelProps = {
    modelId: string
    query?: Query
    onClose: () => void
}

const defaultQueryFields = [
    'code',
    'created',
    'lastUpdated',
    'displayName',
    'id',
    // 'shortName',
    'href',
] as const

const createDefaultDetailsQuery = (resource: string, id: string): Query => ({
    result: {
        resource,
        id,
        params: {
            fields: defaultQueryFields.concat(),
        },
    },
})

type DetailsResponse = Pick<
    BaseIdentifiableObject,
    (typeof defaultQueryFields)[number]
>

export const DetailsPanel = ({
    modelId,
    query,
    onClose,
}: DetailsPanelProps) => {
    const schema = useModelSectionHandleOrThrow()
    // used to prevent changing query after initial render
    const queryRef = useRef(
        query ?? createDefaultDetailsQuery(schema.namePlural, modelId)
    )

    const detailsQueryResponse = useDataQuery<
        WrapQueryResponse<DetailsResponse, 'result'>
    >(queryRef.current)

    // const detailItems = detailsQueryResponse.data?.result.
    return (
        <aside className={css.detailsPanel}>
            <Card className={css.detailsPanelCard}>
                <DetailsPanelHeader onClose={onClose} />
                <Loader queryResponse={detailsQueryResponse}>
                    <DetailsPanelContent
                        data={
                            detailsQueryResponse.data
                                ?.result as NonNullable<DetailsResponse>
                        }
                    />
                </Loader>
            </Card>
        </aside>
    )
}

type DetailsContent = {
    data: DetailsResponse
}

const DetailsPanelContent = ({ data }: DetailsContent) => {
    const detailItems = Object.entries(data)
        .filter(([key]) => key !== 'displayName')
        .map(([key, value]) => (
            <DetailItem
                key={key}
                propertyKey={key}
                label={getTranslatedProperty(key)}
                value={value}
            />
        ))
    return (
        <div className={css.detailsPanelContent}>
            <div className={css.detailsPanelTitle}>{data.displayName}</div>
            <DetailsPanelButtons />
            <DetailsList>{detailItems}</DetailsList>
        </div>
    )
}

const DetailsPanelButtons = () => (
    <ButtonStrip>
        <Button secondary small>
            {i18n.t('Edit')}
        </Button>
    </ButtonStrip>
)

const DetailsPanelHeader = ({ onClose }: { onClose: () => void }) => (
    <header className={css.detailsPanelHeader}>
        <span className={css.detailsPanelHeaderTitle}>{i18n.t('Details')}</span>
        <button className={css.detailsPanelCloseButton} onClick={onClose}>
            <IconCross24 />
        </button>
    </header>
)

export const DetailsList = ({ children }: PropsWithChildren) => (
    <div className={css.detailsList}>{children}</div>
)

export default DetailsPanel
