import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { OVERVIEW_SECTIONS, SECTIONS_MAP } from '../../lib'
import { SummaryCard, SummaryCardGroup } from './card'
import { OverviewGroup, OverviewGroupSummary } from './group'

const TITLE = SECTIONS_MAP.indicator.titlePlural

export const IndicatorsOverview = () => {
    return (
        <OverviewGroup title={TITLE}>
            <OverviewGroupSummary>
                {i18n.t(
                    'Indicators are used to calculate and analyze data based on data elements and other indicators.'
                )}
            </OverviewGroupSummary>
            <IndicatorsCardGroup />
        </OverviewGroup>
    )
}

export const IndicatorsCardGroup = ({ showTitle }: { showTitle?: boolean }) => {
    return (
        <SummaryCardGroup
            title={showTitle ? TITLE : undefined}
            section={OVERVIEW_SECTIONS.indicator}
        >
            <SummaryCard section={SECTIONS_MAP.indicator}>
                {i18n.t(
                    'Create, update, view and delete indicators, specify the numerator and denominator, and set the indicator type.'
                )}
            </SummaryCard>
            <SummaryCard section={SECTIONS_MAP.indicatorType}>
                {i18n.t(
                    'Create, modify, view and delete indicator types. An indicator type is a factor for an indicator, like percentage.'
                )}
            </SummaryCard>
            <SummaryCard section={SECTIONS_MAP.indicatorGroup}>
                {i18n.t(
                    'Create, modify, view and delete indicator groups. Groups are used for improved analysis.'
                )}
            </SummaryCard>
            <SummaryCard section={SECTIONS_MAP.indicatorGroupSet}>
                {i18n.t(
                    'Create, modify, view and delete indicator group sets. Group sets are used for improved analysis.'
                )}
            </SummaryCard>
            <SummaryCard section={SECTIONS_MAP.programIndicator}>
                {i18n.t(
                    'Create, update, view and delete program indicators, define expressions and filters, and configure analytics settings.'
                )}
            </SummaryCard>
            <SummaryCard section={SECTIONS_MAP.programIndicatorGroup}>
                {i18n.t('Group program indicators for easier analysis.')}
            </SummaryCard>
        </SummaryCardGroup>
    )
}

export const Component = IndicatorsOverview
