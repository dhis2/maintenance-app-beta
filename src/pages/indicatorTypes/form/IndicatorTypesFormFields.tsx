import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    StandardFormField,
    StandardFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    NameField,
} from '../../../components'
import { useSchemaSectionHandleOrThrow } from '../../../lib'
import { FactorField } from './FactorField'

export const IndicatorTypesFormFields = () => {
    const schemaSection = useSchemaSectionHandleOrThrow()

    return (
        <StandardFormSection>
            <StandardFormSectionTitle>
                {i18n.t('Basic information')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Set up the basic information for this Indicator Type.'
                )}
            </StandardFormSectionDescription>

            <StandardFormField>
                <NameField schemaSection={schemaSection} />
            </StandardFormField>

            <StandardFormField>
                <FactorField />
            </StandardFormField>
        </StandardFormSection>
    )
}
