import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, RadioFieldFF } from '@dhis2/ui'
import React from 'react'
import { useField, Field as FieldRFF } from 'react-final-form'
import { HorizontalFieldGroup, StandardFormField } from '../../../components'
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
    const userGroupField = useField('notificationRecipient', {
        type: 'radio',
        value: 'USER_GROUP',
    })
    const orgUnitContactField = useField('notificationRecipient', {
        type: 'radio',
        value: 'ORGANISATION_UNIT_CONTACT',
    })

    const isUserGroup = userGroupField.input.checked
    const isOrgUnitContact = orgUnitContactField.input.checked

    return (
        <div>
            <StandardFormField>
                <HorizontalFieldGroup
                    label={i18n.t('Recipient type')}
                    dataTest="formfields-notification-recipient"
                >
                    <RadioFieldFF
                        label={getConstantTranslation('USER_GROUP')}
                        input={userGroupField.input}
                        meta={userGroupField.meta}
                    />
                    <RadioFieldFF
                        label={getConstantTranslation(
                            'ORGANISATION_UNIT_CONTACT'
                        )}
                        input={orgUnitContactField.input}
                        meta={orgUnitContactField.meta}
                    />
                </HorizontalFieldGroup>
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
