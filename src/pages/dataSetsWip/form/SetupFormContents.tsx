import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    DefaultIdentifiableFields,
    DescriptionField,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SectionedFormSection } from '../../../components/sectionedForm'
import { ColorAndIconField } from '../../dataElements/fields'

export const SetupFormContents = React.memo(function SetupFormContents({
    name,
}: {
    name: string
}) {
    return (
        <SectionedFormSection name={name}>
            <StandardFormSectionTitle>
                {i18n.t('Basic information')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t('Set up the basic information for this data set.')}
            </StandardFormSectionDescription>
            <DefaultIdentifiableFields />
            <StandardFormField>
                <DescriptionField />
            </StandardFormField>
            <StandardFormField>
                <ColorAndIconField />
            </StandardFormField>
        </SectionedFormSection>
    )
})
