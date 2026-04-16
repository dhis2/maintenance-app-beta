import i18n from '@dhis2/d2-i18n'
import React, { useEffect, useRef } from 'react'
import { useForm, useFormState } from 'react-final-form'
import {
    SectionedFormSection,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../components'
import {
    AutoGenerateEventField,
    GeneratedByEnrollmentDateField,
    HideDueDateField,
    MinDaysFromStartField,
    OpenAfterEnrollmentField,
    ReportDateToUseField,
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
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up automatic event creation and scheduling in this program stage.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <AutoGenerateEventField />
                </StandardFormField>
                {autoGenerateEvent && (
                    <div style={{ marginInlineStart: '24px' }}>
                        <StandardFormField>
                            <OpenAfterEnrollmentField />
                        </StandardFormField>
                        {openAfterEnrollment && (
                            <StandardFormField>
                                <ReportDateToUseField />
                            </StandardFormField>
                        )}
                    </div>
                )}
                <StandardFormField>
                    <MinDaysFromStartField />
                </StandardFormField>
                <StandardFormField>
                    <GeneratedByEnrollmentDateField />
                </StandardFormField>
                <StandardFormField>
                    <HideDueDateField />
                </StandardFormField>
            </SectionedFormSection>
        )
    }
)
