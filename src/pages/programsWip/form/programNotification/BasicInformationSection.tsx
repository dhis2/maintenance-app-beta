import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { Field as FieldRFF, useFormState } from 'react-final-form'
import { CodeField, NameField, StandardFormField } from '../../../../components'
import { ModelSingleSelectField } from '../../../../components/metadataFormControls/ModelSingleSelect'
import { SchemaSection } from '../../../../lib'

type BasicInformationSectionProps = {
    section: SchemaSection
    programTemplateId?: string
}

export const BasicInformationSection: React.FC<
    BasicInformationSectionProps
> = ({ section, programTemplateId }) => {
    const { values } = useFormState({ subscription: { values: true } })

    return (
        <>
            <StandardFormField>
                <NameField
                    schemaSection={section}
                    modelId={programTemplateId}
                />
            </StandardFormField>
            <StandardFormField>
                <CodeField
                    schemaSection={section}
                    modelId={programTemplateId}
                />
            </StandardFormField>
            <StandardFormField>
                <FieldRFF
                    name="programStage"
                    render={({ input, meta }) => (
                        <ModelSingleSelectField
                            clearable
                            input={input}
                            meta={meta}
                            inputWidth="400px"
                            dataTest="programStage-field"
                            label={i18n.t('Program stage')}
                            disabled={values.id}
                            query={{
                                resource: 'programStages',
                                params: {
                                    fields: ['id', 'displayName'],
                                    filter: `program.id:eq:${values.program.id}`,
                                    paging: false,
                                    order: 'displayName',
                                },
                            }}
                        />
                    )}
                />
            </StandardFormField>
        </>
    )
}
