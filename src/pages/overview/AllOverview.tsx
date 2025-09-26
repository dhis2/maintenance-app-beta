import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { CategoryCardGroup } from './Categories'
import { DataElementsCardGroup } from './DataElements'
import { DataSetsCardGroup } from './DataSets'
import { OverviewGroup } from './group'
import { IndicatorsCardGroup } from './Indicators'
import { OrganisationUnitsCardGroup } from './OrganisationUnits'
import { OtherCardGroup } from './Other'
import { ProgramsAndTrackersCardGroup } from './ProgramsAndTracker'
import { ValidationsCardGroup } from './Validations'

export const AllOverview = () => {
    return (
        <OverviewGroup title={i18n.t('Metadata management')}>
            <CategoryCardGroup showTitle={true} />
            <DataElementsCardGroup showTitle={true} />
            <DataSetsCardGroup showTitle={true} />
            <IndicatorsCardGroup showTitle={true} />
            <OrganisationUnitsCardGroup showTitle={true} />
            <ValidationsCardGroup showTitle={true} />
            <ProgramsAndTrackersCardGroup showTitle={true} />
            <OtherCardGroup showTitle={true} />
        </OverviewGroup>
    )
}

export const Component = AllOverview
export default AllOverview
