import i18n from '@dhis2/d2-i18n'
import {
    CheckboxFieldFF,
    SingleSelectFieldFF,
    TextAreaFieldFF,
} from '@dhis2/ui'
import React, { useEffect } from 'react'
import {
    useField,
    Field as FieldRFF,
    useForm,
    useFormState,
} from 'react-final-form'
import { StandardFormField } from '../../../../components'
import { ModelSingleSelectFormField } from '../../../../components/metadataFormControls/ModelSingleSelect'
import { getConstantTranslation } from '../../../../lib'
import { DeliveryChannelsField } from '../../../dataSetNotificationTemplates/form/DeliveryChannelsField'

export const recipientOptions = [
    {
        label: getConstantTranslation('TRACKED_ENTITY_INSTANCE'),
        value: 'TRACKED_ENTITY_INSTANCE',
    },
    {
        label: getConstantTranslation('ORGANISATION_UNIT_CONTACT'),
        value: 'ORGANISATION_UNIT_CONTACT',
    },
    {
        label: getConstantTranslation('USERS_AT_ORGANISATION_UNIT'),
        value: 'USERS_AT_ORGANISATION_UNIT',
    },
    { label: getConstantTranslation('USER_GROUP'), value: 'USER_GROUP' },
    {
        label: getConstantTranslation('PROGRAM_ATTRIBUTE'),
        value: 'PROGRAM_ATTRIBUTE',
    },
    { label: getConstantTranslation('WEB_HOOK'), value: 'WEB_HOOK' },
]

type ProgramTrackedEntityAttribute = {
    id: string
    trackedEntityAttribute: {
        id: string
        displayName: string
        valueType: string
    }
}

type ProgramWithTEAs = {
    id: string
    displayName: string
    programTrackedEntityAttributes?: ProgramTrackedEntityAttribute[]
}

export const RecipientSection = () => {
    const { input: recipientInput, meta: recipientMeta } = useField(
        'notificationRecipient',
        {
            subscription: { value: true },
        }
    )
    const { initialValues } = useFormState({
        subscription: { initialValues: true },
    })
    const form = useForm()

    const shouldIncludeDeliveryChannel =
        recipientInput.value === 'ORGANISATION_UNIT_CONTACT' ||
        recipientInput.value === 'TRACKED_ENTITY_INSTANCE'

    useEffect(() => {
        form.change('deliveryChannels', initialValues?.deliveryChannels || [])
    }, [recipientInput.value, form, initialValues])

    return (
        <div>
            <StandardFormField>
                <SingleSelectFieldFF
                    inputWidth="400px"
                    name="notificationRecipient"
                    dataTest="formfields-notification-recipient"
                    label={i18n.t('Recipient type (required)')}
                    options={recipientOptions}
                    input={recipientInput}
                    meta={recipientMeta}
                    required
                />
            </StandardFormField>

            {recipientInput.value === 'PROGRAM_ATTRIBUTE' && (
                <StandardFormField>
                    <div style={{ width: '400px' }}>
                        <ModelSingleSelectFormField
                            name="recipientProgramAttribute"
                            dataTest="formfields-recipientProgramAttribute"
                            label={i18n.t('Program attribute Recipient')}
                            query={{
                                resource: 'programs',
                                params: {
                                    fields: [
                                        'id,displayName,programTrackedEntityAttributes[trackedEntityAttribute[id,displayName,valueType]',
                                    ],
                                    filter: [
                                        `id:eq:${initialValues?.program.id}`,
                                    ],
                                },
                            }}
                            clearable={true}
                            transform={(programTEAs) => {
                                const program = programTEAs[0] as
                                    | ProgramWithTEAs
                                    | undefined

                                return (
                                    program?.programTrackedEntityAttributes
                                        ?.filter((x) =>
                                            ['PHONE_NUMBER', 'EMAIL'].includes(
                                                x.trackedEntityAttribute
                                                    .valueType
                                            )
                                        )
                                        .map((x) => x.trackedEntityAttribute) ||
                                    []
                                )
                            }}
                            noMatchWithoutFilterText={i18n.t(
                                'No program attributes of type email or phone number found.'
                            )}
                        />
                    </div>
                </StandardFormField>
            )}
            {recipientInput.value === 'USER_GROUP' && (
                <>
                    <StandardFormField>
                        <div style={{ width: '400px' }}>
                            <ModelSingleSelectFormField
                                name="recipientUserGroup"
                                dataTest="formfields-recipientUserGroup"
                                label={i18n.t('User Group Recipient')}
                                query={{
                                    resource: 'userGroups',
                                    params: {
                                        fields: ['id', 'displayName'],
                                        order: 'displayName:asc',
                                    },
                                }}
                                clearable={true}
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

            {recipientInput.value === 'WEB_HOOK' && (
                <FieldRFF
                    component={TextAreaFieldFF}
                    dataTest="formfields-messageTemplate"
                    inputWidth="400px"
                    name="messageTemplate"
                    label={i18n.t('Web hook message URL (required)')}
                />
            )}

            {shouldIncludeDeliveryChannel && (
                <StandardFormField>
                    <DeliveryChannelsField />
                </StandardFormField>
            )}
        </div>
    )
}
