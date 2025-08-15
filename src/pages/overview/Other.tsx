import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { OVERVIEW_SECTIONS, SECTIONS_MAP } from '../../lib'
import { SummaryCard, SummaryCardGroup } from './card'
import { OverviewGroup } from './group'

const TITLE = OVERVIEW_SECTIONS.other.titlePlural

export const OtherOverview = () => {
    return (
        <OverviewGroup title={TITLE}>
            {/* <OverviewGroupSummary>
                {i18n.t(
                    'Placeholder for other'
                )}
            </OverviewGroupSummary> */}
            <OtherCardGroup />
        </OverviewGroup>
    )
}

export const OtherCardGroup = ({ showTitle }: { showTitle?: boolean }) => {
    return (
        <SummaryCardGroup
            title={showTitle ? TITLE : undefined}
            section={OVERVIEW_SECTIONS.organisationUnit}
        >
            <SummaryCard section={SECTIONS_MAP.optionGroup}>
                {i18n.t(
                    'Create a group of options from option sets that has a similar functional area or meaning.'
                )}
            </SummaryCard>
            <SummaryCard section={SECTIONS_MAP.optionGroupSet}>
                {i18n.t('Create, modify and view sets of option groups.')}
            </SummaryCard>
            <SummaryCard
                section={SECTIONS_MAP.programDisaggregation}
                hideNew={true}
            >
                {i18n.t('Set disaggregation mappings for program indicators.')}
            </SummaryCard>
        </SummaryCardGroup>
    )
}

export const Component = OtherOverview
