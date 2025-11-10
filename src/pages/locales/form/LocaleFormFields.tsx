import i18n from '@dhis2/d2-i18n'
import { NoticeBox, TextAreaFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import {
    StandardFormField,
    StandardFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
} from '../../../components'
import { LanguageField } from './LanguageField'
import { CountryField } from './CountryField'

export const LocaleFormFields = () => {
    return (
        <>
            <StandardFormSection>
                <NoticeBox warning>
                    {i18n.t("Locale can't be edited after it's created.")}
                </NoticeBox>
            </StandardFormSection>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this locale.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <LanguageField />
                </StandardFormField>

                <StandardFormField>
                    <CountryField />
                </StandardFormField>
            </StandardFormSection>
        </>
    )
}

