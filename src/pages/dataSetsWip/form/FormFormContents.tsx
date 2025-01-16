import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { StandardFormSectionTitle } from '../../../components'
import { SectionedFormSection } from '../../../components/sectionedForm'

export const FormFormContents = ({ name }: { name: string }) => {
    return (
        <SectionedFormSection name={name}>
            <StandardFormSectionTitle>
                {i18n.t('Data entry form')}
            </StandardFormSectionTitle>
            <div style={{ height: 300 }} />
        </SectionedFormSection>
    )
}
