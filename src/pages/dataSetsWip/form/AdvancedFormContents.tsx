import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SectionedFormSection } from '../../../components/sectionedForm'

export const AdvancedFormContents = ({ name }: { name: string }) => {
    return (
        <SectionedFormSection name={name}>
            <StandardFormSectionTitle>
                {i18n.t('Advanced options')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'These options are used for advanced data set configurations.'
                )}
            </StandardFormSectionDescription>
            <div style={{ height: 900 }} />
        </SectionedFormSection>
    )
}
