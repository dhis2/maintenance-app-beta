import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SectionedFormSection } from '../../../components/sectionedForm'

export const OrganisationUnitsFormContents = ({ name }: { name: string }) => {
    return (
        <SectionedFormSection name={name}>
            <StandardFormSectionTitle>
                {i18n.t('Organisation units')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Configure which organisation units can collect data for this data set.'
                )}
            </StandardFormSectionDescription>
            <div style={{ height: 300 }} />
        </SectionedFormSection>
    )
}
