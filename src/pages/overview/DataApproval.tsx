import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { OVERVIEW_SECTIONS, SECTIONS_MAP } from '../../lib'
import { SummaryCard, SummaryCardGroup } from './card'
import { OverviewGroup, OverviewGroupSummary } from './group'

const TITLE = i18n.t('Data Approval')

export const DataApprovalOverview = () => {
    return (
        <OverviewGroup title={TITLE}>
            <OverviewGroupSummary>
                {i18n.t(
                    'Data approval workflows create a process for authorized users to review and approve data at specified levels.'
                )}
            </OverviewGroupSummary>
            <DataApprovalCardGroup />
        </OverviewGroup>
    )
}

export const DataApprovalCardGroup = ({
    showTitle,
}: {
    showTitle?: boolean
}) => {
    return (
        <SummaryCardGroup
            title={showTitle ? TITLE : undefined}
            section={OVERVIEW_SECTIONS.dataApproval}
        >
            <SummaryCard section={SECTIONS_MAP.dataApprovalLevel}>
                {i18n.t(
                    'Configure data approval levels for use in data approval workflows.'
                )}
            </SummaryCard>
            <SummaryCard section={SECTIONS_MAP.dataApprovalWorkflow}>
                {i18n.t('Configure data approval workflows.')}
            </SummaryCard>
        </SummaryCardGroup>
    )
}

export const Component = DataApprovalOverview
