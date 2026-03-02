import i18n from '@dhis2/d2-i18n'
import React, { useEffect, useRef } from 'react'
import { useForm, useFormState } from 'react-final-form'
import {
    SectionedFormSection,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
    StandardFormSubsectionTitle,
} from '../../../../components'
import {
    AllowGenerateNextVisitField,
    AutoGenerateEventField,
    GeneratedByEnrollmentDateField,
    HideDueDateField,
    MinDaysFromStartField,
    NextScheduleDateField,
    OpenAfterEnrollmentField,
    PeriodTypeField,
    RemindCompletedField,
    RepeatableField,
    ReportDateToUseField,
    StandardIntervalField,
} from './fields'

export const StageCreationAndSchedulingFormContents = React.memo(
    function StageCreationAndSchedulingFormContents({
        name,
        sectionLabel,
    }: {
        name: string
        sectionLabel: string
    }) {
        const form = useForm()
        const { values } = useFormState({ subscription: { values: true } })
        const prevAutoGenerateEvent = useRef<boolean | undefined>(undefined)
        const prevOpenAfterEnrollment = useRef<boolean | undefined>(undefined)

        const autoGenerateEvent = values?.autoGenerateEvent ?? false
        const openAfterEnrollment = values?.openAfterEnrollment ?? false

        useEffect(() => {
            if (prevAutoGenerateEvent.current === true && !autoGenerateEvent) {
                form.change('openAfterEnrollment', false)
                form.change('reportDateToUse', undefined)
            }
            prevAutoGenerateEvent.current = autoGenerateEvent
        }, [autoGenerateEvent, form])

        useEffect(() => {
            if (
                prevOpenAfterEnrollment.current === true &&
                !openAfterEnrollment
            ) {
                form.change('reportDateToUse', undefined)
            }
            prevOpenAfterEnrollment.current = openAfterEnrollment
        }, [openAfterEnrollment, form])

        return (
            <SectionedFormSection name={name}>
                <StandardFormSectionTitle>
                    {sectionLabel}
                </StandardFormSectionTitle>
                <StandardFormSubsectionTitle>
                    {i18n.t('Event repetition')}
                </StandardFormSubsectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Define the frequency of events within this stage.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <RepeatableField />
                </StandardFormField>
                <StandardFormField>
                    <StandardIntervalField />
                </StandardFormField>

                <StandardFormSubsectionTitle>
                    {i18n.t('Event scheduling')}
                </StandardFormSubsectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Configure how and when events in this stage are scheduled.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <GeneratedByEnrollmentDateField />
                </StandardFormField>
                <StandardFormField>
                    <AutoGenerateEventField />
                </StandardFormField>
                {autoGenerateEvent && (
                    <StandardFormField>
                        <OpenAfterEnrollmentField />
                    </StandardFormField>
                )}
                {autoGenerateEvent && (
                    <StandardFormField>
                        <ReportDateToUseField />
                    </StandardFormField>
                )}
                <StandardFormField>
                    <MinDaysFromStartField />
                </StandardFormField>
                <StandardFormField>
                    <HideDueDateField />
                </StandardFormField>
                <StandardFormField>
                    <PeriodTypeField />
                </StandardFormField>
                <StandardFormField>
                    <NextScheduleDateField />
                </StandardFormField>

                <StandardFormSubsectionTitle>
                    {i18n.t('Completion options')}
                </StandardFormSubsectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Decide what should happen after a user completes this event.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <AllowGenerateNextVisitField />
                </StandardFormField>
                <StandardFormField>
                    <RemindCompletedField />
                </StandardFormField>
            </SectionedFormSection>
        )
    }
)
