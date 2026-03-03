import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, Radio } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { Field, useField, useFormState } from 'react-final-form'
import {
    SectionedFormSection,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'
import styles from './EnrollmentSettingsFormContents.module.css'

export const EnrollmentSettingsFormContents = React.memo(
    function EnrollmentSettingsFormContents({ name }: { name: string }) {
        const { values } = useFormState()

        const {
            input: displayIncidentDateInput,
            meta: displayIncidentDateMate,
        } = useField('displayIncidentDate', {
            subscription: { value: true },
            type: 'checkbox',
        })

        const {
            input: selectIncidentDatesInput,
            meta: selectIncidentDatesMeta,
        } = useField('selectIncidentDatesInFuture', {
            subscription: { value: true },
            type: 'checkbox',
        })

        useEffect(() => {
            if (
                !displayIncidentDateInput.value &&
                selectIncidentDatesInput.value
            ) {
                selectIncidentDatesInput.onChange(false)
            }
        }, [displayIncidentDateInput.value, selectIncidentDatesInput])

        return (
            <SectionedFormSection name={name}>
                <StandardFormSectionTitle>
                    {i18n.t('Enrollment: Settings', { nsSeparator: '~:~' })}
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
                                fields: 'id,displayName,name,trackedEntityTypeAttributes[trackedEntityAttribute[id,displayName,unique,valueType],mandatory,searchable,displayInList]',
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
                        <Field name="onlyEnrollOnce" type="radio" value={true}>
                            {({ input }) => (
                                <Radio
                                    checked={input.checked}
                                    onChange={() => input.onChange(true)}
                                    label={i18n.t('Only allow one enrollment')}
                                    value="true"
                                />
                            )}
                        </Field>

                        <Field name="onlyEnrollOnce" type="radio" value={false}>
                            {({ input }) => (
                                <Radio
                                    checked={input.checked}
                                    onChange={() => input.onChange(false)}
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
                    <CheckboxFieldFF
                        input={displayIncidentDateInput}
                        meta={displayIncidentDateMate}
                        label={i18n.t('Collect an incident date')}
                    />
                </StandardFormField>

                <StandardFormField>
                    <div className={styles.selectIncidentDatesInFuture}>
                        <CheckboxFieldFF
                            input={selectIncidentDatesInput}
                            meta={selectIncidentDatesMeta}
                            disabled={!values.displayIncidentDate}
                            label={i18n.t('Allow incident dates in the future')}
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

                <StandardFormField>
                    <Field
                        name="ignoreOverdueEvents"
                        type="checkbox"
                        component={CheckboxFieldFF}
                        label={i18n.t(
                            'Do not create overdue events when automatically creating program stage events'
                        )}
                    />
                </StandardFormField>
            </SectionedFormSection>
        )
    }
)
