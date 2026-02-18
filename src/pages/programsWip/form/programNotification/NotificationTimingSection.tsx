import i18n from '@dhis2/d2-i18n'
import {
    CheckboxFieldFF,
    InputFieldFF,
    SingleSelectField,
    SingleSelectFieldFF,
    SingleSelectOption,
} from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { Field as FieldRFF, useField, useForm } from 'react-final-form'
import { StandardFormField } from '../../../../components'
import { getConstantTranslation } from '../../../../lib'

export const programTriggerOptions = [
    { label: getConstantTranslation('ENROLLMENT'), value: 'ENROLLMENT' },
    { label: getConstantTranslation('COMPLETION'), value: 'COMPLETION' },
    { label: getConstantTranslation('PROGRAM_RULE'), value: 'PROGRAM_RULE' },
    {
        label: getConstantTranslation('SCHEDULED_DAYS_INCIDENT_DATE'),
        value: 'SCHEDULED_DAYS_INCIDENT_DATE',
    },
    {
        label: getConstantTranslation('SCHEDULED_DAYS_ENROLLMENT_DATE'),
        value: 'SCHEDULED_DAYS_ENROLLMENT_DATE',
    },
]

export const programStageTriggerOptions = [
    { label: i18n.t('Program stage completion'), value: 'COMPLETION' },
    {
        label: getConstantTranslation('SCHEDULED_DAYS_DUE_DATE'),
        value: 'SCHEDULED_DAYS_DUE_DATE',
    },
    { label: getConstantTranslation('PROGRAM_RULE'), value: 'PROGRAM_RULE' },
]

export const NotificationTimingSection = ({
    isStageNotification,
}: {
    isStageNotification: boolean
}) => {
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
    const { input: relativeScheduledDaysInput } = useField(
        'relativeScheduledDays'
    )

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
    useEffect(() => {
        if (!isStageNotification) {
            form.change('sendRepeatable', undefined)
        }
    }, [isStageNotification, form])

    const handleBeforeAfterChange = (newValue: 'BEFORE' | 'AFTER') => {
        const absValue = Math.abs(Number(relativeScheduledDaysInput.value) || 0)
        const signed = newValue === 'BEFORE' ? -absValue : absValue
        form.change('relativeScheduledDays', signed)
    }

    const triggerOptions = isStageNotification
        ? programStageTriggerOptions
        : programTriggerOptions

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
                        <FieldRFF
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
                            // format={(value) => value?.toString() ?? ''}
                            format={(value: unknown) => {
                                const parsed =
                                    typeof value === 'number'
                                        ? Math.abs(value)
                                        : value
                                return parsed?.toString() ?? ''
                            }}
                            parse={(value: unknown) => {
                                const parsed =
                                    typeof value === 'string'
                                        ? Number.parseInt(value ?? '', 10)
                                        : undefined
                                if (!parsed || Number.isNaN(parsed)) {
                                    return undefined
                                }
                                return beforeAfter === 'BEFORE'
                                    ? -parsed
                                    : parsed
                            }}
                        />
                    </StandardFormField>
                </div>
            )}

            {isStageNotification && (
                <StandardFormField>
                    <FieldRFF
                        component={CheckboxFieldFF}
                        name="sendRepeatable"
                        label={i18n.t(
                            'Allow notification to be sent multiple times'
                        )}
                        type="checkbox"
                        dataTest="formfields-sendRepeatable"
                    />
                </StandardFormField>
            )}
        </div>
    )
}
