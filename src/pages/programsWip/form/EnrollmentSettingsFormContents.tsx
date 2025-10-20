import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, Box, Radio } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { Field, useField, useForm, useFormState } from 'react-final-form'
import {
    SearchableSingleSelect,
    SectionedFormSection,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'
import styles from './EnrollmentSettingsFormContents.module.css'

const trackedEntityTypesQuery = {
    trackedEntityTypes: {
        resource: 'trackedEntityTypes',
        params: {
            fields: 'id,displayName,name',
            paging: false,
        },
    },
}

type TrackedEntityType = {
    id: string
    displayName: string
    name: string
}

type QueryResult = {
    trackedEntityTypes?: {
        trackedEntityTypes: TrackedEntityType[]
    }
}

export const EnrollmentSettingsFormContents = React.memo(
    function EnrollmentSettingsFormContents({ name }: { name: string }) {
        const { values } = useFormState()

        const { input: displayIncidentDateInput } = useField(
            'displayIncidentDate',
            {
                subscription: { value: true },
            }
        )

        const { input: selectIncidentDatesInput } = useField(
            'selectIncidentDatesInFuture',
            {
                subscription: { value: true },
            }
        )

        useEffect(() => {
            if (
                !displayIncidentDateInput.value &&
                selectIncidentDatesInput.value
            ) {
                selectIncidentDatesInput.onChange(false)
            }
        }, [displayIncidentDateInput.value])

        return (
            <SectionedFormSection name={name}>
                <StandardFormSectionTitle>
                    {i18n.t('Enrollment: Settings')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Configure settings related to enrollment in this program.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <ModelSingleSelectFormField
                        required
                        inputWidth="500px"
                        name="trackedEntityType"
                        label={i18n.t('Tracked entity type')}
                        helpText={i18n.t(
                            'Choose what this program will be tracking'
                        )}
                        query={{
                            resource: 'trackedEntityTypes',
                            params: {
                                fields: 'id,displayName,name',
                                paging: false,
                            },
                        }}
                    />
                </StandardFormField>

                <StandardFormField>
                    <span className={styles.enrollmentOptionLabel}>
                        {i18n.t('Multiple enrollments')}
                    </span>
                    <div className={styles.radioGroup}>
                        <Field
                            name="onlyEnrollOnce"
                            type="radio"
                            value="true"
                            checked
                        >
                            {({ input }) => (
                                <Radio
                                    checked={input.checked}
                                    onChange={() => input.onChange('true')}
                                    label={i18n.t('Only allow one enrollment')}
                                    value="true"
                                />
                            )}
                        </Field>

                        <Field name="onlyEnrollOnce" type="radio" value="false">
                            {({ input }) => (
                                <Radio
                                    checked={input.checked}
                                    onChange={() => input.onChange('false')}
                                    label={i18n.t('Allow multiple enrollments')}
                                    value="false"
                                />
                            )}
                        </Field>
                    </div>

                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Applies to the entire lifetime of a tracked entity.'
                        )}
                    </StandardFormSectionDescription>
                </StandardFormField>

                <StandardFormField>
                    <Field
                        name="selectEnrollmentDatesInFuture"
                        type="checkbox"
                        component={CheckboxFieldFF}
                        label={i18n.t('Allow enrollment dates in the future')}
                    />
                </StandardFormField>

                <StandardFormField>
                    <Field
                        name="displayIncidentDate"
                        type="checkbox"
                        component={CheckboxFieldFF}
                        label={i18n.t('Collect an incident date')}
                    />
                </StandardFormField>

                <StandardFormField>
                    <div className={styles.selectIncidentDatesInFuture}>
                        <Field
                            name="selectIncidentDatesInFuture"
                            type="checkbox"
                            component={CheckboxFieldFF}
                            label={i18n.t('Allow incident dates in the future')}
                            disabled={!values.displayIncidentDate}
                        />
                    </div>
                </StandardFormField>

                <StandardFormField>
                    <Field
                        name="useFirstStageDuringRegistration"
                        type="checkbox"
                        component={CheckboxFieldFF}
                        label={i18n.t(
                            'Collect data for the first stage during enrollment'
                        )}
                    />
                </StandardFormField>
            </SectionedFormSection>
        )
    }
)
