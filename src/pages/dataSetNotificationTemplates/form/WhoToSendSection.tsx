import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'

export const WhoToSendSection = () => {
    const { input: recipientInput } = useField('notificationRecipient')

    const isUserGroup =
        recipientInput.value === 'USER_GROUP' || !recipientInput.value

    const isOrgUnitContact =
        recipientInput.value === 'ORGANISATION_UNIT_CONTACT'

    const recipientOptions = [
        { label: i18n.t('User Group'), value: 'USER_GROUP' },
        {
            label: i18n.t('Organisation Unit Contact'),
            value: 'ORGANISATION_UNIT_CONTACT',
        },
    ]

    return (
        <div>
            <StandardFormField>
                <FieldRFF<string | undefined>
                    name="notificationRecipient"
                    initialValue="USER_GROUP"
                    required
                    render={(props) => (
                        <SingleSelectFieldFF
                            {...props}
                            inputWidth="400px"
                            dataTest="formfields-notification-recipient"
                            label={i18n.t('Notification Recipient')}
                            options={recipientOptions}
                        />
                    )}
                />
            </StandardFormField>

            {isUserGroup && (
                <StandardFormField>
                    <div style={{ width: '400px' }}>
                        <ModelSingleSelectFormField
                            name="recipientUserGroup"
                            label={i18n.t('User Group Recipients')}
                            required
                            query={{
                                resource: 'userGroups',
                                params: {
                                    fields: ['id', 'displayName'],
                                    order: 'displayName:asc',
                                },
                            }}
                        />
                    </div>
                </StandardFormField>
            )}

            {isOrgUnitContact && (
                <StandardFormField>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <FieldRFF
                            component={CheckboxFieldFF}
                            dataTest="formfields-send-sms"
                            label={i18n.t('SMS')}
                            name="sendSms"
                            type="checkbox"
                        />
                        <FieldRFF
                            component={CheckboxFieldFF}
                            dataTest="formfields-send-email"
                            label={i18n.t('Email')}
                            name="sendEmail"
                            type="checkbox"
                        />
                    </div>
                </StandardFormField>
            )}
        </div>
    )
}
