import i18n from '@dhis2/d2-i18n'
import { CheckboxField } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { HorizontalFieldGroup } from '../../../components'

export const DeliveryChannelsField = () => {
    const { input } = useField<string[]>('deliveryChannels', {
        subscription: { value: true },
    })

    const deliveryChannelsSet = new Set(input.value ?? [])

    const isEmail = deliveryChannelsSet.has('EMAIL')
    const isSms = deliveryChannelsSet.has('SMS')

    const createHandleOnChange = (channel: string) => {
        return ({ checked }: { checked: boolean }) => {
            const newChannels = new Set(input.value ?? [])
            if (checked) {
                newChannels.add(channel)
            } else {
                newChannels.delete(channel)
            }
            input.onChange(Array.from(newChannels))
        }
    }

    return (
        <HorizontalFieldGroup>
            <CheckboxField
                name="sendSms"
                dataTest="formfields-sendSms"
                label={i18n.t('SMS')}
                checked={isSms}
                onChange={createHandleOnChange('SMS')}
            />
            <CheckboxField
                name="sendEmail"
                dataTest="formfields-sendEmail"
                label={i18n.t('Email')}
                checked={isEmail}
                onChange={createHandleOnChange('EMAIL')}
            />
        </HorizontalFieldGroup>
    )
}
