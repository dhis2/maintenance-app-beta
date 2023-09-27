import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { OVERVIEW_SECTIONS, SECTIONS_MAP } from '../../lib'
import { FilterAuthorizedSections, SummaryCard, SummaryCardGroup } from './card'
import { OverviewGroup, OverviewGroupSummary } from './group'

const TITLE = SECTIONS_MAP.category.titlePlural

export const CategoryOverview = () => {
    return (
        <OverviewGroup title={TITLE}>
            <OverviewGroupSummary>
                {i18n.t(
                    'Categories are typically a concept, for example "Gender", "Age" or "Disease Status". Use categories to disaggregate data elements into individual components. You can also use category combinations to assign metadata attributes to all data recorded in a specific dataset.'
                )}
            </OverviewGroupSummary>
            <CategoryCardGroup />
        </OverviewGroup>
    )
}

export const CategoryCardGroup = ({ showTitle }: { showTitle?: boolean }) => {
    return (
        <SummaryCardGroup
            title={showTitle ? TITLE : undefined}
            section={OVERVIEW_SECTIONS.category}
        >
            <FilterAuthorizedSections>
                <SummaryCard section={SECTIONS_MAP.categoryOption}>
                    {i18n.t(
                        'Individual values or options that can be selected within a category.'
                    )}
                </SummaryCard>
                <SummaryCard section={SECTIONS_MAP.category}>
                    {i18n.t(
                        'Disaggregate data elements into individual components.'
                    )}
                </SummaryCard>
                <SummaryCard section={SECTIONS_MAP.categoryCombo}>
                    {i18n.t(
                        'Combine multiple categories into a related set that can be assigned to data elements for dissagregation. Can also be used to to assign metadata attributes to data sets or programs.'
                    )}
                </SummaryCard>
                <SummaryCard section={SECTIONS_MAP.categoryOptionCombo}>
                    {i18n.t(
                        `Specify code and attributes to enable easier data exchange with other systems.`
                    )}
                </SummaryCard>
                <SummaryCard section={SECTIONS_MAP.categoryOptionGroup}>
                    {i18n.t(
                        'Group category options and improve analysis with category option group sets.'
                    )}
                </SummaryCard>
                <SummaryCard section={SECTIONS_MAP.categoryOptionGroupSet}>
                    {i18n.t(
                        'Classify category options groups to add more dimensionality to captured data for analysis.'
                    )}
                </SummaryCard>
            </FilterAuthorizedSections>
        </SummaryCardGroup>
    )
}

export const Component = CategoryOverview
