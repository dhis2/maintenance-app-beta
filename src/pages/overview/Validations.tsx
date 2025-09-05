import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { OVERVIEW_SECTIONS, SECTIONS_MAP } from '../../lib'
import { SummaryCard, SummaryCardGroup } from './card'
import { OverviewGroup, OverviewGroupSummary } from './group'

const TITLE = OVERVIEW_SECTIONS.validation.titlePlural

export const ValidationsOverview = () => {
    return (
        <OverviewGroup title={TITLE}>
            <OverviewGroupSummary>
                {i18n.t('This is some text for validations')}
            </OverviewGroupSummary>
            <ValidationsCardGroup />
        </OverviewGroup>
    )
}

export const ValidationsCardGroup = ({
    showTitle,
}: {
    showTitle?: boolean
}) => {
    return (
        <SummaryCardGroup
            title={showTitle ? TITLE : undefined}
            section={OVERVIEW_SECTIONS.validation}
        >
            <SummaryCard section={SECTIONS_MAP.validationNotificationTemplate}>
                {i18n.t('Sends a notification when a validation rule failed.')}
            </SummaryCard>
        </SummaryCardGroup>
    )
}

export const Component = ValidationsOverview
