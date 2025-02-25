import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { OVERVIEW_SECTIONS, SECTIONS_MAP } from '../../lib'
import { SummaryCard, SummaryCardGroup } from './card'
import { OverviewGroup, OverviewGroupSummary } from './group'

const TITLE = SECTIONS_MAP.dataSet.titlePlural

export const DataSetsOverview = () => {
    return (
        <OverviewGroup title={TITLE}>
            <OverviewGroupSummary>
                {i18n.t(
                    'Data sets are collections of data elements grouped for aggregate data entry, validation, access, collection frequency and reporting. Data entry forms are defined and configured by data sets. They help streamline the management of data collection routines and ensure consistency across different stages of data handling within DHIS2.'
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
            <SummaryCard section={SECTIONS_MAP.dataSet}>
                {i18n.t(
                    'Create, update, view and delete data sets, specify the related data elements, period type organisation units, sharing settings and workflow approval here.'
                )}
            </SummaryCard>
        </SummaryCardGroup>
    )
}

export const Component = DataSetsOverview
