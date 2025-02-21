import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { OVERVIEW_SECTIONS, SECTIONS_MAP } from '../../lib'
import { FilterAuthorizedSections, SummaryCard, SummaryCardGroup } from './card'
import { OverviewGroup, OverviewGroupSummary } from './group'

const TITLE = SECTIONS_MAP.dataElement.titlePlural

export const DataElementsOverview = () => {
    return (
        <OverviewGroup title={TITLE}>
            <OverviewGroupSummary>
                {i18n.t(
                    'Data elements are fundamental units for data collection in DHIS2, representing individual data points for both tracker and aggregate data. They serve as the building blocks for capturing, analysing, and reporting information.'
                )}
            </OverviewGroupSummary>
            <DataElementsCardGroup />
        </OverviewGroup>
    )
}

export const DataElementsCardGroup = ({
    showTitle,
}: {
    showTitle?: boolean
}) => {
    return (
        <SummaryCardGroup
            title={showTitle ? TITLE : undefined}
            section={OVERVIEW_SECTIONS.dataElement}
        >
            <FilterAuthorizedSections>
                <SummaryCard section={SECTIONS_MAP.dataElement}>
                    {i18n.t(
                        'Create, update, view and delete data elements: the foundation of data collection and analysis.',
                        { nsSeparator: '~:~' }
                    )}
                </SummaryCard>
                <SummaryCard section={SECTIONS_MAP.dataElementGroup}>
                    {i18n.t(
                        'Improve analysis of single data elements by combining them into data element groups.'
                    )}
                </SummaryCard>
                <SummaryCard section={SECTIONS_MAP.dataElementGroupSet}>
                    {i18n.t(
                        'Add another level of organisation by grouping data element groups into group sets.'
                    )}
                </SummaryCard>
            </FilterAuthorizedSections>
        </SummaryCardGroup>
    )
}

export const Component = DataElementsOverview
