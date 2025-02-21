import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { OVERVIEW_SECTIONS, SECTIONS_MAP } from '../../lib'
import { FilterAuthorizedSections, SummaryCard, SummaryCardGroup } from './card'
import { OverviewGroup, OverviewGroupSummary } from './group'

const TITLE = SECTIONS_MAP.dataSet.titlePlural

export const DataSetsOverview = () => {
    return (
        <OverviewGroup title={TITLE}>
            <OverviewGroupSummary>
                {i18n.t(
                    'Data sets structure how data should be entered and create data entry forms for data collection. A data set defines what data should be collected, when it should be collected, and where it should be collected.'
                )}
            </OverviewGroupSummary>
            <DataSetsCardGroup />
        </OverviewGroup>
    )
}

export const DataSetsCardGroup = ({ showTitle }: { showTitle?: boolean }) => {
    return (
        <SummaryCardGroup
            title={showTitle ? TITLE : undefined}
            section={OVERVIEW_SECTIONS.dataSet}
        >
            <FilterAuthorizedSections>
                <SummaryCard section={SECTIONS_MAP.dataSet}>
                    {i18n.t(
                        'A data set defines what data should be collected, when it should be collected, and where it should be collected.'
                    )}
                </SummaryCard>
            </FilterAuthorizedSections>
        </SummaryCardGroup>
    )
}

export const Component = DataSetsOverview
