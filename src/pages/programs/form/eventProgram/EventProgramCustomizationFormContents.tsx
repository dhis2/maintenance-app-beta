import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'
import {
    ColorAndIconField,
    SectionedFormSection,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../components'
import { useSchemaSectionHandleOrThrow, useValidator } from '../../../../lib'

export const EventProgramCustomizationFormContents = React.memo(
    function EventProgramCustomizationFormContents({ name }: { name: string }) {
        const schemaSection = useSchemaSectionHandleOrThrow()
        const reportDateLabelValidator = useValidator({
            schemaSection,
            property: 'incidentDateLabel',
        })

        return (
            <SectionedFormSection name={name}>
                <StandardFormSectionTitle>
                    {i18n.t('Program customization')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        "Customize the program's visuals, labels, and display settings."
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <ColorAndIconField />
                </StandardFormField>

                <StandardFormField>
                    <Field
                        component={InputFieldFF}
                        name="incidentDateLabel"
                        inputWidth="400px"
                        label={i18n.t('Custom label for "Report date"')}
                        helpText={i18n.t(
                            'Used as the default registration date for events'
                        )}
                        dataTest="formfields-incidentDateLabel"
                        validate={reportDateLabelValidator}
                    />
                </StandardFormField>
            </SectionedFormSection>
        )
    }
)
