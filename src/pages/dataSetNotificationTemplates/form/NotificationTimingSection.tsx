import i18n from '@dhis2/d2-i18n'
import { InputFieldFF, Radio, RadioFieldFF } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { Field as FieldRFF, useField, useForm } from 'react-final-form'
import { HorizontalFieldGroup, StandardFormField } from '../../../components'
import { getConstantTranslation } from '../../../lib'

export const triggerOptions = [
    {
        label: getConstantTranslation('DATA_SET_COMPLETION'),
        value: 'DATA_SET_COMPLETION',
    },
    {
        label: getConstantTranslation('SCHEDULED_DAYS'),
        value: 'SCHEDULED_DAYS',
    },
]

export const NotificationTimingSection = () => {
    const completionField = useField('dataSetNotificationTrigger', {
        type: 'radio',
        value: 'DATA_SET_COMPLETION',
    })
    const scheduledDaysField = useField('dataSetNotificationTrigger', {
        type: 'radio',
        value: 'SCHEDULED_DAYS',
    })
    const collectiveSummaryField = useField('sendStrategy', {
        type: 'radio',
        value: 'COLLECTIVE_SUMMARY',
    })
    const singleNotificationField = useField('sendStrategy', {
        type: 'radio',
        value: 'SINGLE_NOTIFICATION',
    })
    const form = useForm()
    const isScheduledDays = scheduledDaysField.input.checked

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
                <HorizontalFieldGroup
                    label={i18n.t('When to send notification')}
                    dataTest="formfields-dataSetNotificationTrigger"
                >
                    <RadioFieldFF
                        label={getConstantTranslation('DATA_SET_COMPLETION')}
                        input={completionField.input}
                        meta={completionField.meta}
                    />
                    <RadioFieldFF
                        label={getConstantTranslation('SCHEDULED_DAYS')}
                        input={scheduledDaysField.input}
                        meta={scheduledDaysField.meta}
                    />
                </HorizontalFieldGroup>
            </StandardFormField>

            {isScheduledDays && (
                <div data-test="scheduledDaysSelector">
                    <StandardFormField>
                        <HorizontalFieldGroup
                            label={i18n.t(
                                'Send before or after scheduled date'
                            )}
                            dataTest="formfields-beforeOrAfter"
                        >
                            <Radio
                                label={i18n.t('Before')}
                                value="BEFORE"
                                checked={beforeAfter === 'BEFORE'}
                                onChange={() => {
                                    setBeforeAfter('BEFORE')
                                    handleBeforeAfterChange('BEFORE')
                                }}
                            />
                            <Radio
                                label={i18n.t('After')}
                                value="AFTER"
                                checked={beforeAfter === 'AFTER'}
                                onChange={() => {
                                    setBeforeAfter('AFTER')
                                    handleBeforeAfterChange('AFTER')
                                }}
                            />
                        </HorizontalFieldGroup>
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
                            format={(value: string | undefined) => {
                                const parsed = Math.abs(
                                    parseInt(value ?? '', 10)
                                )
                                return isNaN(parsed) ? '' : String(parsed)
                            }}
                            parse={(value: string | undefined) => {
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

                    <StandardFormField>
                        <HorizontalFieldGroup
                            label={i18n.t('Send notification as')}
                            dataTest="formfields-notification-type"
                        >
                            <RadioFieldFF
                                label={getConstantTranslation(
                                    'COLLECTIVE_SUMMARY'
                                )}
                                input={collectiveSummaryField.input}
                                meta={collectiveSummaryField.meta}
                            />
                            <RadioFieldFF
                                label={getConstantTranslation(
                                    'SINGLE_NOTIFICATION'
                                )}
                                input={singleNotificationField.input}
                                meta={singleNotificationField.meta}
                            />
                        </HorizontalFieldGroup>
                    </StandardFormField>
                </div>
            )}
        </div>
    )
}
