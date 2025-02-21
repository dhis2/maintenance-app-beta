import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { OVERVIEW_SECTIONS, SECTIONS_MAP } from '../../lib'
import { FilterAuthorizedSections, SummaryCard, SummaryCardGroup } from './card'
import { OverviewGroup, OverviewGroupSummary } from './group'

const TITLE = SECTIONS_MAP.organisationUnit.titlePlural

export const OrganisationUnitsOverview = () => {
    return (
        <OverviewGroup title={TITLE}>
            <OverviewGroupSummary>
                {i18n.t(
                    'Organisation units define the locations, or points of service, for which data can be collected. For example, they might be departments, offices, hospitals or clinics. Organisation units can be organised by group and group set.'
                )}
            </OverviewGroupSummary>
            <OrganisationUnitsCardGroup />
        </OverviewGroup>
    )
}

export const OrganisationUnitsCardGroup = ({
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
                    {i18n.t(
                        'An individual organisation unit specifies a location for which data can be collected.'
                    )}
                </SummaryCard>
                <SummaryCard section={SECTIONS_MAP.organisationUnitGroup}>
                    {i18n.t(
                        'Improve analysis of single organisation units by combining them into organisation unit groups.'
                    )}
                </SummaryCard>
                <SummaryCard section={SECTIONS_MAP.organisationUnitGroupSet}>
                    {i18n.t(
                        'Add another level of organisation by grouping organisation unit groups into group sets.'
                    )}
                </SummaryCard>
                <SummaryCard section={SECTIONS_MAP.organisationUnitLevel}>
                    {i18n.t(
                        'Organisation unit levels define how organisation units can be structured into a hierarchy and what names are used in that hierarchy.'
                    )}
                </SummaryCard>
            </FilterAuthorizedSections>
        </SummaryCardGroup>
    )
}

export const Component = OrganisationUnitsOverview
