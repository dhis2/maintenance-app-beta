import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { CategoryCardGroup } from './Categories'
import { DataElementsCardGroup } from './DataElements'
import { DataSetsCardGroup } from './DataSets'
import { OverviewGroup } from './group'
import { IndicatorsCardGroup } from './Indicators'
import { OrganisationUnitsCardGroup } from './OrganisationUnits'
import { OtherCardGroup } from './Other'

export const AllOverview = () => {
    return (
        <OverviewGroup title={i18n.t('Metadata management')}>
            <DataElementsCardGroup showTitle={true} />
            <CategoryCardGroup showTitle={true} />
            <DataSetsCardGroup showTitle={true} />
            <OrganisationUnitsCardGroup showTitle={true} />
            <IndicatorsCardGroup showTitle={true} />
            <OtherCardGroup showTitle={true} />
        </OverviewGroup>
    )
}

export const Component = AllOverview
export default AllOverview
