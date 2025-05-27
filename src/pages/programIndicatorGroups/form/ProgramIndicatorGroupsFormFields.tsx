import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    StandardFormField,
    StandardFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    NameField,
    CodeField,
    ModelTransferField,
} from '../../../components'
import { useSchemaSectionHandleOrThrow } from '../../../lib'

export const ProgramIndicatorGroupsFormFields = () => {
    const schemaSection = useSchemaSectionHandleOrThrow()

    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this Program Indicator Group.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <NameField schemaSection={schemaSection} />
                </StandardFormField>

                <StandardFormField>
                    <CodeField schemaSection={schemaSection} />
                </StandardFormField>
            </StandardFormSection>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    <label htmlFor={'indicators'}>{i18n.t('Indicators')}</label>
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose the indicators to include in this program indicator group.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <ModelTransferField
                        name={'programIndicators'}
                        query={{
                            resource: 'programIndicators',
                        }}
                        leftHeader={i18n.t('Available indicators')}
                        rightHeader={i18n.t('Selected indicators')}
                        filterPlaceholder={i18n.t(
                            'Search available indicators'
                        )}
                        filterPlaceholderPicked={i18n.t(
                            'Search selected indicators'
                        )}
                    />
                </StandardFormField>
            </StandardFormSection>
        </>
    )
}
