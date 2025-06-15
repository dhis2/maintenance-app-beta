import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF, CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { StandardFormField } from '../../../components'

const query = {
    userGroups: {
        resource: 'userGroups',
        params: {
            fields: 'id,displayName,name',
            paging: false,
        },
    },
}

export const WhoToSendSection = () => {
    const { loading, data } = useDataQuery(query)
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

    const userGroupOptions =
        (
            data as {
                userGroups?: {
                    userGroups?: Array<{ id: string; displayName: string }>
                }
            }
        )?.userGroups?.userGroups?.map((group) => ({
            label: group.displayName,
            value: group.id,
        })) || []

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
                    <FieldRFF<string | undefined>
                        name="recipientUserGroup"
                        required
                        render={(props) => (
                            <SingleSelectFieldFF
                                {...props}
                                dataTest="formfields-user-group-recipient"
                                label={i18n.t('User Group Recipients')}
                                inputWidth="400px"
                                options={userGroupOptions}
                                loading={loading}
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
