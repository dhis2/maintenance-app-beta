import i18n from '@dhis2/d2-i18n'
import { Radio } from '@dhis2/ui'
import React, { useState } from 'react'
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
    const [isStageNotification, setIsStageNotification] = useState(
        values.programStage?.id
    )

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
                <p>{i18n.t('Notification type')}</p>
                <Radio
                    disabled={values.id}
                    checked={!isStageNotification}
                    onChange={({ checked }) => {
                        setIsStageNotification(!checked)
                    }}
                    label={i18n.t(
                        'Program: Send when there is activity in the program or enrollment',
                        { nsSeparator: '~:~' }
                    )}
                />
                <Radio
                    disabled={values.id}
                    checked={isStageNotification}
                    onChange={({ checked }) => {
                        setIsStageNotification(checked)
                    }}
                    label={i18n.t(
                        'Stage: Send when there is activity in a specific stage',
                        {
                            nsSeparator: '~:~',
                        }
                    )}
                />
            </StandardFormField>
            {isStageNotification && (
                <FieldRFF
                    name="programStage"
                    render={({ input, meta }) => (
                        <StandardFormField>
                            <ModelSingleSelectField
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
                        </StandardFormField>
                    )}
                />
            )}
        </>
    )
}
