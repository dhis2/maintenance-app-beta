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
                {i18n.t(
                    'Validations are used to provide important feedback during data entry to enhance data quality. Validation rules define expected criteria for specific data elements and display warnings at three levels of importance if these criteria are not met.'
                )}
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
            <SummaryCard section={SECTIONS_MAP.validationRule}>
                {i18n.t(
                    'Add, modify, view and delete validation rules. Anomalies can be discovered by running validation rules against the data.'
                )}
            </SummaryCard>
            <SummaryCard section={SECTIONS_MAP.validationRuleGroup}>
                {i18n.t(
                    'Add, modify, view and delete validation rule groups. Provides the ability to group and run validation rules together.'
                )}
            </SummaryCard>
            <SummaryCard section={SECTIONS_MAP.validationNotificationTemplate}>
                {i18n.t('Sends a notification when a validation rule failed.')}
            </SummaryCard>
        </SummaryCardGroup>
    )
}

export const Component = ValidationsOverview
