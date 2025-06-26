import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'
import { DeliveryChannelsField } from './DeliveryChannelsField'

export const RecipientSection = () => {
    const { input: recipientInput, meta: recipientMeta } = useField(
        'notificationRecipient',
        {
            subscription: { value: true },
        }
    )

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
                <SingleSelectFieldFF
                    inputWidth="400px"
                    name="notificationRecipient"
                    dataTest="formfields-notification-recipient"
                    label={i18n.t('Recipient type')}
                    options={recipientOptions}
                    input={recipientInput}
                    meta={recipientMeta}
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
                    <DeliveryChannelsField />
                </StandardFormField>
            )}
        </div>
    )
}
