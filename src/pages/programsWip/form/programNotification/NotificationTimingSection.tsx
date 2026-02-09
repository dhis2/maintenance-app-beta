import i18n from '@dhis2/d2-i18n'
import {
    SingleSelectFieldFF,
    InputFieldFF,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { Field as FieldRFF, useField, useForm } from 'react-final-form'
import { StandardFormField } from '../../../../components'
import { getConstantTranslation } from '../../../../lib'

export const triggerOptions = [
    { label: getConstantTranslation('ENROLLMENT'), value: 'ENROLLMENT' },
    { label: getConstantTranslation('COMPLETION'), value: 'COMPLETION' },
    { label: getConstantTranslation('PROGRAM_RULE'), value: 'PROGRAM_RULE' },
    // {  label: getConstantTranslation("SCHEDULED_DAYS_DUE_DATE") , value:"SCHEDULED_DAYS_DUE_DATE"} ,
    {
        label: getConstantTranslation('SCHEDULED_DAYS_INCIDENT_DATE'),
        value: 'SCHEDULED_DAYS_INCIDENT_DATE',
    },
    {
        label: getConstantTranslation('SCHEDULED_DAYS_ENROLLMENT_DATE'),
        value: 'SCHEDULED_DAYS_ENROLLMENT_DATE',
    },
]

export const NotificationTimingSection = () => {
    const { input: triggerInput, meta: triggerMeta } = useField(
        'notificationTrigger'
    )
    const form = useForm()
    const isScheduledDays = [
        'SCHEDULED_DAYS_DUE_DATE',
        'SCHEDULED_DAYS_INCIDENT_DATE',
        'SCHEDULED_DAYS_ENROLLMENT_DATE',
    ].includes(triggerInput.value)

    // Subscribe to relativeScheduledDays to determine sign
    const { input: relativeScheduledDaysInput } = useField<
        number | string | undefined
    >('relativeScheduledDays')

    const relativeDaysValue = Number(relativeScheduledDaysInput.value) || 0
    const [beforeAfter, setBeforeAfter] = useState(
        relativeDaysValue < 0 ? 'BEFORE' : 'AFTER'
    )
    useEffect(() => {
        setBeforeAfter(relativeDaysValue < 0 ? 'BEFORE' : 'AFTER')
    }, [relativeDaysValue])
    useEffect(() => {
        if (!isScheduledDays) {
            setBeforeAfter('AFTER')
            form.change('relativeScheduledDays', undefined)
        }
    }, [isScheduledDays, form])

    const handleBeforeAfterChange = (newValue: 'BEFORE' | 'AFTER') => {
        const absValue = Math.abs(Number(relativeScheduledDaysInput.value) || 0)
        const signed = newValue === 'BEFORE' ? -absValue : absValue
        form.change('relativeScheduledDays', signed)
    }

    return (
        <div>
            <StandardFormField>
                <SingleSelectFieldFF
                    name="notificationTrigger"
                    dataTest="formfields-notificationTrigger"
                    label={i18n.t('When to send notification (required)')}
                    inputWidth="500px"
                    options={triggerOptions}
                    input={triggerInput}
                    meta={triggerMeta}
                    required
                />
            </StandardFormField>

            {isScheduledDays && (
                <div data-test="scheduledDaysSelector">
                    <StandardFormField>
                        <SingleSelectField
                            label={i18n.t(
                                'Send before or after scheduled date'
                            )}
                            selected={beforeAfter}
                            dataTest="formfields-beforeOrAfter"
                            onChange={({ selected }: { selected: string }) => {
                                setBeforeAfter(selected)
                                handleBeforeAfterChange(
                                    selected as 'BEFORE' | 'AFTER'
                                )
                            }}
                            inputWidth="120px"
                        >
                            <SingleSelectOption
                                label={i18n.t('Before')}
                                value="BEFORE"
                            />
                            <SingleSelectOption
                                label={i18n.t('After')}
                                value="AFTER"
                            />
                        </SingleSelectField>
                    </StandardFormField>
                    <StandardFormField>
                        <FieldRFF<string | undefined>
                            label={i18n.t(
                                'Number of days {{beforeOrAfter}} scheduled date to send notification',
                                {
                                    beforeOrAfter:
                                        beforeAfter === 'BEFORE'
                                            ? i18n.t('before')
                                            : i18n.t('after'),
                                }
                            )}
                            component={InputFieldFF}
                            dataTest="formfields-relativeScheduledDays"
                            name="relativeScheduledDays"
                            type="number"
                            inputWidth="80px"
                            format={(value) => {
                                const parsed = Math.abs(
                                    parseInt(value ?? '', 10)
                                )
                                return isNaN(parsed) ? '' : String(parsed)
                            }}
                            parse={(value) => {
                                const parsed = parseInt(value ?? '', 10)
                                if (isNaN(parsed)) {
                                    return undefined
                                }
                                const signed =
                                    beforeAfter === 'BEFORE' ? -parsed : parsed
                                return String(signed)
                            }}
                        />
                    </StandardFormField>
                </div>
            )}
        </div>
    )
}
