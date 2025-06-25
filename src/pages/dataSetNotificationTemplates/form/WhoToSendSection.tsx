import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { ModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect'
import { PartialLoadedDisplayableModel } from '../../../types/models'

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
                    <FieldRFF<PartialLoadedDisplayableModel | undefined>
                        name="recipientUserGroup"
                        render={({ input }) => (
                            <ModelSingleSelect
                                // label={i18n.t('User Group Recipients')}
                                selected={input.value}
                                onChange={input.onChange}
                                // inputWidth="400px"
                                query={{
                                    resource: 'userGroups',
                                    params: {
                                        fields: ['id', 'displayName'],
                                        order: 'displayName:asc',
                                    },
                                }}
                            />
                        )}
                    />
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
