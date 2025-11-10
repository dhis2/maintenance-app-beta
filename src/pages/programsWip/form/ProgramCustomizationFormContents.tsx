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

export const ProgramCustomizationFormContents = React.memo(
    function ProgramCustomizationFormContents({ name }: { name: string }) {
        return (
            <SectionedFormSection name={name}>
                <StandardFormSectionTitle>
                    {i18n.t('Program Customization')}
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
                        label={i18n.t('Custom label for "Incident date"')}
                        helpText={i18n.t(
                            'Used as an additional registration date for enrollments'
                        )}
                        dataTest="formfields-incidentDateLabel"
                    />
                </StandardFormField>

                <StandardFormField>
                    <Field
                        component={InputFieldFF}
                        name="enrollmentDateLabel"
                        inputWidth="400px"
                        label={i18n.t('Custom label for "Enrollment date"')}
                        helpText={i18n.t(
                            'Used as the default registration date for enrollments'
                        )}
                        dataTest="formfields-enrollmentDateLabel"
                    />
                </StandardFormField>

                <StandardFormField>
                    <Field
                        component={InputFieldFF}
                        name="enrollmentLabel"
                        inputWidth="400px"
                        label={i18n.t('Custom label for "Enrollment"')}
                        helpText={i18n.t(
                            'Example use: See all data in this enrollment'
                        )}
                        dataTest="formfields-enrollmentLabel"
                    />
                </StandardFormField>

                <StandardFormField>
                    <Field
                        component={InputFieldFF}
                        name="eventLabel"
                        inputWidth="400px"
                        label={i18n.t('Custom label for "Event"')}
                        helpText={i18n.t('Example use: Schedule a new event')}
                        dataTest="formfields-eventLabel"
                    />
                </StandardFormField>

                <StandardFormField>
                    <Field
                        component={InputFieldFF}
                        name="programStageLabel"
                        inputWidth="400px"
                        label={i18n.t('Custom label for "Program stage"')}
                        helpText={i18n.t(
                            'Example use: See all data in this program stage'
                        )}
                        dataTest="formfields-programStageLabel"
                    />
                </StandardFormField>

                <StandardFormField>
                    <Field
                        component={InputFieldFF}
                        name="followUpLabel"
                        inputWidth="400px"
                        label={i18n.t('Custom label for "Follow-up"')}
                        helpText={i18n.t(
                            'Used to customize the label for follow-up events or activities'
                        )}
                        dataTest="formfields-followUpLabel"
                    />
                </StandardFormField>

                <StandardFormField>
                    <Field
                        component={InputFieldFF}
                        name="orgUnitLabel"
                        inputWidth="400px"
                        label={i18n.t('Custom label for "Registering unit"')}
                        helpText={i18n.t(
                            'Used to customize the label for the organisation unit that registers the enrollment or event'
                        )}
                        dataTest="formfields-orgUnitLabel"
                    />
                </StandardFormField>

                <StandardFormField>
                    <Field
                        component={InputFieldFF}
                        name="relationshipLabel"
                        inputWidth="400px"
                        label={i18n.t('Custom label for "Relationship"')}
                        helpText={i18n.t(
                            'Used to customize the label for relationships between tracked entities'
                        )}
                        dataTest="formfields-relationshipLabel"
                    />
                </StandardFormField>

                <StandardFormField>
                    <Field
                        component={InputFieldFF}
                        name="noteLabel"
                        inputWidth="400px"
                        label={i18n.t('Custom label for "Note"')}
                        helpText={i18n.t(
                            'Used to customize the label for notes or comments added to enrollments or events'
                        )}
                        dataTest="formfields-noteLabel"
                    />
                </StandardFormField>

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
