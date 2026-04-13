import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    NameField,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SECTIONS_MAP } from '../../../lib'
import { PhaseField } from '../fields/PhaseField'
import { SqlField } from '../fields/SqlField'

const section = SECTIONS_MAP.analyticsTableHook

export const AnalyticsTableHookFormFields = () => {
    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this analytics table hook.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <NameField schemaSection={section} />
                </StandardFormField>
                <PhaseField />
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Advanced')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Configure the SQL that should run for this hook.')}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <SqlField />
                </StandardFormField>
            </StandardFormSection>
        </>
    )
}
