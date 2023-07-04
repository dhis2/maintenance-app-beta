import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { OVERVIEW_SECTIONS, SECTIONS_MAP } from '../../constants'
import { FilterAuthorizedSections, SummaryCard, SummaryCardGroup } from './card'
import { OverviewGroup, OverviewGroupSummary } from './group'

const TITLE = SECTIONS_MAP.dataElement.titlePlural

export const DataElementsOverview = () => {
    return (
        <OverviewGroup title={TITLE}>
            <OverviewGroupSummary>
                {i18n.t(
                    'Data elements are the core foundational item of DHIS2 and are used for data collection. Data elements can be organised by group and group set.'
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
                        'Building block elements of your database. The foundation of data collection and analysis.'
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
