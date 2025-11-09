import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { useField, useFormState } from 'react-final-form'
import {
    SectionedFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    StandardFormField,
    NameField,
    CodeField,
    DescriptionField,
} from '../../../components'
import {
    getValueTypeOptions,
    useSchemaSectionHandleOrThrow,
} from '../../../lib'

export const BasicInfoFormContents = React.memo(
    function OptionSetSetupFormContents({ name }: { name: string }) {
        const schemaSection = useSchemaSectionHandleOrThrow()
        const { values } = useFormState({ subscription: { values: true } })
        const { input: valueTypeInput, meta: valueTypeMeta } =
            useField('valueType')

        const isEdit = Boolean(values.id)

        return (
            <SectionedFormSection name={name}>
                <StandardFormSectionTitle>
                    {i18n.t('Option Set Details')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this option set.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <NameField schemaSection={schemaSection} />
                </StandardFormField>

                <StandardFormField>
                    <CodeField schemaSection={schemaSection} />
                </StandardFormField>

                <StandardFormField>
                    <DescriptionField />
                </StandardFormField>

                <StandardFormField>
                    <SingleSelectFieldFF
                        label={i18n.t('Value type')}
                        name="valueType"
                        options={getValueTypeOptions()}
                        input={valueTypeInput}
                        meta={valueTypeMeta}
                        inputWidth="400px"
                        disabled={isEdit}
                        dataTest="formfields-valuetype"
                    />
                </StandardFormField>
            </SectionedFormSection>
        )
    }
)
