import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { OVERVIEW_SECTIONS, SECTIONS_MAP } from '../../lib'
import { FilterAuthorizedSections, SummaryCard, SummaryCardGroup } from './card'
import { OverviewGroup, OverviewGroupSummary } from './group'

const TITLE = SECTIONS_MAP.organisationUnit.titlePlural

export const OrganisationUnitOverview = () => {
    return (
        <OverviewGroup title={TITLE}>
            <OverviewGroupSummary>
                {i18n.t('Organisation Units are ...')}
            </OverviewGroupSummary>
            <OrganisationUnitCardGroup />
        </OverviewGroup>
    )
}

export const OrganisationUnitCardGroup = ({
    showTitle,
}: {
    showTitle?: boolean
}) => {
    return (
        <SummaryCardGroup
            title={showTitle ? TITLE : undefined}
            section={OVERVIEW_SECTIONS.organisationUnit}
        >
            <FilterAuthorizedSections>
                <SummaryCard section={SECTIONS_MAP.organisationUnit}>
                    {i18n.t('....')}
                </SummaryCard>
                <SummaryCard section={SECTIONS_MAP.organisationUnitGroup}>
                    {i18n.t('....')}
                </SummaryCard>
                <SummaryCard section={SECTIONS_MAP.organisationUnitGroupSet}>
                    {i18n.t('...')}
                </SummaryCard>
            </FilterAuthorizedSections>
        </SummaryCardGroup>
    )
}

export const Component = OrganisationUnitOverview
