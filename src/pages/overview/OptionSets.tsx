import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { OVERVIEW_SECTIONS, SECTIONS_MAP } from '../../lib'
import { SummaryCard, SummaryCardGroup } from './card'
import { OverviewGroup, OverviewGroupSummary } from './group'

const TITLE = SECTIONS_MAP.optionSet.titlePlural

export const OptionSetsOverview = () => {
    return (
        <OverviewGroup title={TITLE}>
            <OverviewGroupSummary>
                {i18n.t(
                    'Option sets are used to limit data entry to defined values.'
                )}
            </OverviewGroupSummary>
            <OptionSetsCardGroup />
        </OverviewGroup>
    )
}

export const OptionSetsCardGroup = ({ showTitle }: { showTitle?: boolean }) => {
    return (
        <SummaryCardGroup
            title={showTitle ? TITLE : undefined}
            section={OVERVIEW_SECTIONS.optionSet}
        >
            <SummaryCard section={SECTIONS_MAP.optionSet}>
                {i18n.t(
                    'Create option sets which can be included in data elements and produce drop-down lists in data entry forms.'
                )}
            </SummaryCard>
            <SummaryCard section={SECTIONS_MAP.optionGroup}>
                {i18n.t(
                    'Create a group of options from option sets that has a similar functional area or meaning.'
                )}
            </SummaryCard>
            <SummaryCard section={SECTIONS_MAP.optionGroupSet}>
                {i18n.t('Create, modify and view sets of option groups.')}
            </SummaryCard>
        </SummaryCardGroup>
    )
}

export const Component = OptionSetsOverview
