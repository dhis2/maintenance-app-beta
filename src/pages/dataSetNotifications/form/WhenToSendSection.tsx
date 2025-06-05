import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF, InputFieldFF } from '@dhis2/ui'
import { Field as FieldRFF, useField } from 'react-final-form'
import { StandardFormField } from '../../../components'

export const WhenToSendSection = () => {
    const { input: triggerInput } = useField('notificationTrigger')
    const isScheduledDays = triggerInput.value === 'SCHEDULED_DAYS'

    const triggerOptions = [
        { label: i18n.t('Dataset Completion'), value: 'COMPLETION' },
        { label: i18n.t('Scheduled Days'), value: 'SCHEDULED_DAYS' },
    ]

    const beforeAfterOptions = [
        { label: i18n.t('Before'), value: 'BEFORE' },
        { label: i18n.t('After'), value: 'AFTER' },
    ]

    const notificationTypeOptions = [
        { label: i18n.t('None'), value: 'NONE' },
        { label: i18n.t('Collective Summary'), value: 'COLLECTIVE_SUMMARY' },
        { label: i18n.t('Single Notification'), value: 'SINGLE_NOTIFICATION' },
    ]

    return (
        <div>
            <StandardFormField>
                <FieldRFF<string | undefined>
                    component={SingleSelectFieldFF}
                    dataTest="formfields-notification-trigger"
                    label={i18n.t('Dataset Notification Trigger')}
                    name="notificationTrigger"
                    options={triggerOptions}
                    initialValue="COMPLETION"
                    required
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
                            <FieldRFF<string>
                                component={InputFieldFF}
                                dataTest="formfields-notification-days"
                                name="notificationDays"
                                type="number"
                                min="1"
                                inputWidth="80px"
                                required
                            />
                            <span>{i18n.t('days')}</span>
                            <FieldRFF<string | undefined>
                                component={SingleSelectFieldFF}
                                dataTest="formfields-before-after"
                                name="beforeAfter"
                                options={beforeAfterOptions}
                                initialValue="BEFORE"
                                required
                            />
                            <span>{i18n.t('scheduled date')}</span>
                        </div>
                    </StandardFormField>

                    <StandardFormField>
                        <FieldRFF<string | undefined>
                            component={SingleSelectFieldFF}
                            dataTest="formfields-notification-type"
                            label={i18n.t('Send notification as')}
                            name="notificationType"
                            options={notificationTypeOptions}
                            initialValue="NONE"
                            required
                        />
                    </StandardFormField>
                </>
            )}
        </div>
    )
}
