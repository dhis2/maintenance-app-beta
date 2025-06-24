import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF, InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { StandardFormField } from '../../../components'

export const WhenToSendSection = () => {
    const { input: triggerInput } = useField('dataSetNotificationTrigger')
    const isScheduledDays = triggerInput.value === 'SCHEDULED_DAYS'

    const triggerOptions = [
        { label: i18n.t('Dataset Completion'), value: 'DATA_SET_COMPLETION' },
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
                    dataTest="formfields-notification-trigger"
                    name="dataSetNotificationTrigger"
                    render={(props) => (
                        <SingleSelectFieldFF
                            {...props}
                            label={i18n.t('Dataset Notification Trigger')}
                            inputWidth="500px"
                            options={triggerOptions}
                            required
                        />
                    )}
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
                            <FieldRFF
                                component={InputFieldFF}
                                dataTest="formfields-notification-days"
                                name="relativeScheduledDays"
                                type="number"
                                min="1"
                                inputWidth="80px"
                                required
                            />
                            <span>{i18n.t('days')}</span>
                            <FieldRFF<string | undefined>
                                dataTest="formfields-before-after"
                                name="beforeAfter"
                                initialValue="BEFORE"
                                render={(props) => (
                                    <SingleSelectFieldFF
                                        {...props}
                                        options={beforeAfterOptions}
                                        inputWidth="120px"
                                    />
                                )}
                            />
                            <span>{i18n.t('scheduled date')}</span>
                        </div>
                    </StandardFormField>

                    <StandardFormField>
                        <FieldRFF<string | undefined>
                            inputWidth="500px"
                            dataTest="formfields-notification-type"
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
