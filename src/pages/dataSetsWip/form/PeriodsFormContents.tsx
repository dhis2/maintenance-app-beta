import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SectionedFormSection } from '../../../components/sectionedForm'
import { PeriodTypeField } from './PeriodTypeField'

export const PeriodsContents = ({ name }: { name: string }) => {
    return (
        <SectionedFormSection name={name}>
            <StandardFormSectionTitle>
                {i18n.t('Configure data entry periods')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Choose for what time periods data can be entered for this data set'
                )}
            </StandardFormSectionDescription>
            <PeriodTypeField />
        </SectionedFormSection>
    )
}
