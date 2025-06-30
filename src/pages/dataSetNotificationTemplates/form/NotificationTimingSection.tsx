import i18n from '@dhis2/d2-i18n'
import {
    SingleSelectFieldFF,
    InputFieldFF,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField, useForm } from 'react-final-form'
import { StandardFormField } from '../../../components'

export const NotificationTimingSection = () => {
    const { input: triggerInput, meta: triggerMeta } = useField(
        'dataSetNotificationTrigger'
    )
    const form = useForm()
    const isScheduledDays = triggerInput.value === 'SCHEDULED_DAYS'

    // Subscribe to relativeScheduledDays to determine sign
    const { input: relativeScheduledDaysInput } = useField<
        number | string | undefined
    >('relativeScheduledDays')

    const relativeDaysValue = Number(relativeScheduledDaysInput.value) || 0
    const beforeAfter = relativeDaysValue < 0 ? 'BEFORE' : 'AFTER'

    const handleBeforeAfterChange = (newValue: 'BEFORE' | 'AFTER') => {
        const absValue = Math.abs(Number(relativeScheduledDaysInput.value) || 0)
        const signed = newValue === 'BEFORE' ? -absValue : absValue
        form.change('relativeScheduledDays', signed)
    }

    const triggerOptions = [
        {
            label: i18n.t('Immediately after data set completion'),
            value: 'DATA_SET_COMPLETION',
        },
        { label: i18n.t('Scheduled Days'), value: 'SCHEDULED_DAYS' },
    ]

    const notificationTypeOptions = [
        { label: i18n.t('None'), value: 'NONE' },
        { label: i18n.t('Collective Summary'), value: 'COLLECTIVE_SUMMARY' },
        { label: i18n.t('Single Notification'), value: 'SINGLE_NOTIFICATION' },
    ]

    return (
        <div>
            <StandardFormField>
                <SingleSelectFieldFF
                    name="dataSetNotificationTrigger"
                    label={i18n.t('When to send notification')}
                    inputWidth="500px"
                    options={triggerOptions}
                    required
                    input={triggerInput}
                    meta={triggerMeta}
                />
            </StandardFormField>

            {isScheduledDays && (
                <>
                    <StandardFormField>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                            }}
                        >
                            <span>{i18n.t('Send notification')}</span>
                            <FieldRFF<string | undefined>
                                component={InputFieldFF}
                                dataTest="formfields-notification-days"
                                name="relativeScheduledDays"
                                type="number"
                                inputWidth="80px"
                                parse={(value) => {
                                    const parsed = parseInt(value ?? '', 10)
                                    return isNaN(parsed)
                                        ? undefined
                                        : String(parsed)
                                }}
                                required
                            />

                            <span>{i18n.t('days')}</span>
                            <SingleSelectField
                                selected={beforeAfter}
                                onChange={({
                                    selected,
                                }: {
                                    selected: string
                                }) =>
                                    handleBeforeAfterChange(
                                        selected as 'BEFORE' | 'AFTER'
                                    )
                                }
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

                            <span>{i18n.t('scheduled date')}</span>
                        </div>
                    </StandardFormField>

                    <StandardFormField>
                        <FieldRFF<string | undefined>
                            inputWidth="500px"
                            dataTest="formfields-notification-type"
                            initialValue="SINGLE_NOTIFICATION"
                            name="sendStrategy"
                            render={(props) => (
                                <SingleSelectFieldFF
                                    {...props}
                                    label={i18n.t('Send notification as')}
                                    options={notificationTypeOptions}
                                />
                            )}
                            required
                        />
                    </StandardFormField>
                </>
            )}
        </div>
    )
}
