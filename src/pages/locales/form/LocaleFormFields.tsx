import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React from 'react'
import {
    StandardFormField,
    StandardFormSection,
    StandardFormSectionTitle,
} from '../../../components'
import { CountryField } from './CountryField'
import { LanguageField } from './LanguageField'

export const LocaleFormFields = () => {
    return (
        <>
            <StandardFormSection>
                <NoticeBox warning>
                    {i18n.t(
                        'Locale will not be editable after it has been created.'
                    )}
                </NoticeBox>
            </StandardFormSection>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>

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
