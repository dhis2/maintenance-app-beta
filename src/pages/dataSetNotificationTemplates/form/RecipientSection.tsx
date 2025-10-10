import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { useField, Field as FieldRFF } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'
import { getConstantTranslation, required } from '../../../lib'
import { DeliveryChannelsField } from './DeliveryChannelsField'

export const recipientOptions = [
    { label: getConstantTranslation('USER_GROUP'), value: 'USER_GROUP' },
    {
        label: getConstantTranslation('ORGANISATION_UNIT_CONTACT'),
        value: 'ORGANISATION_UNIT_CONTACT',
    },
]

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
                <>
                    <StandardFormField>
                        <div style={{ width: '400px' }}>
                            <ModelSingleSelectFormField
                                name="recipientUserGroup"
                                dataTest="formfields-recipientUserGroup"
                                label={i18n.t('User Group Recipient')}
                                validate={required}
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
                    <StandardFormField>
                        <FieldRFF
                            component={CheckboxFieldFF}
                            name="notifyUsersInHierarchyOnly"
                            label={i18n.t('Notify users in hierarchy only')}
                            type="checkbox"
                            dataTest="formfields-notifyUsersInHierarchyOnly"
                        />
                    </StandardFormField>
                </>
            )}

            {isOrgUnitContact && (
                <StandardFormField>
                    <DeliveryChannelsField />
                </StandardFormField>
            )}
        </div>
    )
}
