import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'
import {
    SectionedFormSection,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { ColorAndIconField } from '../../dataElements/fields'

export const CustomizationFormContents = React.memo(
    function CustomizationFormContents({ name }: { name: string }) {
        // Custom label fields - field names are assumptions based on common patterns
        // TODO: Verify backend field names match these assumptions
        const customLabelFields = [
            {
                name: 'labelProgramStage',
                label: i18n.t('Custom label for "Program stage"'),
                helpText: i18n.t(
                    'Example use: See all data in this program stage'
                ),
            },
            {
                name: 'labelEvent',
                label: i18n.t('Custom label for "Event"'),
                helpText: i18n.t('Example use: Schedule a new event'),
            },
            {
                name: 'labelEnrollmentDate',
                label: i18n.t('Custom label for "Enrollment date"'),
                helpText: i18n.t(
                    'Used as the default registration date for enrollments'
                ),
            },
            {
                name: 'labelIncidentDate',
                label: i18n.t('Custom label for "Incident date"'),
                helpText: i18n.t(
                    'Used as an additional registration date for enrollments'
                ),
            },
            {
                name: 'labelEnrollment',
                label: i18n.t('Custom label for "Enrollment"'),
                helpText: i18n.t(
                    'Example use: See all data in this enrollment'
                ),
            },
            {
                name: 'labelFollowUp',
                label: i18n.t('Custom label for "Follow-up"'),
                helpText: i18n.t(
                    'Used to customize the label for follow-up events or activities'
                ),
            },
            {
                name: 'labelRegisteringUnit',
                label: i18n.t('Custom label for "Registering unit"'),
                helpText: i18n.t(
                    'Used to customize the label for the organisation unit that registers the enrollment or event'
                ),
            },
            {
                name: 'labelRelationship',
                label: i18n.t('Custom label for "Relationship"'),
                helpText: i18n.t(
                    'Used to customize the label for relationships between tracked entities'
                ),
            },
            {
                name: 'labelNote',
                label: i18n.t('Custom label for "Note"'),
                helpText: i18n.t(
                    'Used to customize the label for notes or comments added to enrollments or events'
                ),
            },
        ]

        return (
            <SectionedFormSection name={name}>
                <StandardFormSectionTitle>
                    {i18n.t('Customization')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        "Customize the program's visuals, labels, and display settings."
                    )}
                </StandardFormSectionDescription>

                {/* Visual Configuration Section */}
                <StandardFormField>
                    <ColorAndIconField />
                </StandardFormField>

                {/* Custom Label Fields Section */}
                {customLabelFields.map((field) => (
                    <StandardFormField key={field.name}>
                        <Field
                            component={InputFieldFF}
                            name={field.name}
                            inputWidth="400px"
                            label={field.label}
                            helpText={field.helpText}
                            dataTest={`formfields-${field.name}`}
                        />
                    </StandardFormField>
                ))}

                {/* Display Front Page List Checkbox */}
                <StandardFormField>
                    <Field
                        name="displayFrontPageList"
                        type="checkbox"
                        component={CheckboxFieldFF}
                        label={i18n.t(
                            'Display enrolled TEs in the front page list'
                        )}
                        dataTest="formfields-displayFrontPageList"
                    />
                </StandardFormField>
            </SectionedFormSection>
        )
    }
)
