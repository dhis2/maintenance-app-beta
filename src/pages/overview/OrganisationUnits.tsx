import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { OVERVIEW_SECTIONS, SECTIONS_MAP } from '../../lib'
import { SummaryCard, SummaryCardGroup } from './card'
import { OverviewGroup, OverviewGroupSummary } from './group'

const TITLE = SECTIONS_MAP.organisationUnit.titlePlural

export const OrganisationUnitsOverview = () => {
    return (
        <OverviewGroup title={TITLE}>
            <OverviewGroupSummary>
                {i18n.t(
                    'Organisation units are the structural entities within DHIS2 that define locations or points of service where data is collected. Examples include regions, hospitals, clinics, or departments. They help establish the hierarchy and scope for data access, collection, reporting, and analysis. Organisation units can be organised into groups and group sets.'
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
            <SummaryCard section={SECTIONS_MAP.organisationUnit}>
                {i18n.t(
                    'Create, update, view and delete individual organisation units.'
                )}
            </SummaryCard>
            <SummaryCard section={SECTIONS_MAP.organisationUnitGroup}>
                {i18n.t(
                    'Categorise similar organisation units into groups, like hospitals or clinics, enabling efficient data aggregation and analysis across diverse locations in DHIS2.'
                )}
            </SummaryCard>
            <SummaryCard section={SECTIONS_MAP.organisationUnitGroupSet}>
                {i18n.t(
                    'Organise multiple groups with shared characteristics into sets, allowing for another level of data analysis and comparison across the organisation structure.'
                )}
            </SummaryCard>
            <SummaryCard section={SECTIONS_MAP.organisationUnitLevel}>
                {i18n.t(
                    'Organisation unit levels define hierarchical layers within the organisation structure, such as national or regional tiers, and specify the names used for each level.'
                )}
            </SummaryCard>
        </SummaryCardGroup>
    )
}

export const Component = OrganisationUnitsOverview
