import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
    getSectionPath,
    SECTIONS_MAP,
    useNavigateWithSearchState,
} from '../../../lib'
import { createFormError } from '../../../lib/form/createFormError'
import { useCreateModel } from '../../../lib/form/useCreateModel'

const section = SECTIONS_MAP.dataSetNotificationTemplate

export const useOnSaveNotifications = () => {
    const createModel = useCreateModel('dataSetNotificationTemplates')
    const navigate = useNavigateWithSearchState()
    const queryClient = useQueryClient()

    return useMemo(
        () => async (values: any) => {
            try {
                const {
                    name,
                    subjectTemplate,
                    messageTemplate,
                    notificationRecipient,
                    notificationTrigger,
                    notificationDays,
                    notificationType,
                    userGroupRecipient,
                    dataSets,
                    sendEmail,
                    sendSms,
                } = values

                const payload: any = {
                    name,
                    displayName: name,
                    subjectTemplate,
                    messageTemplate,
                    notificationRecipient,
                    dataSetNotificationTrigger: notificationTrigger,
                    dataSets: (dataSets || []).map((id: string) => ({ id })),
                }

                if (notificationRecipient === 'ORGANISATION_UNIT_CONTACT') {
                    const deliveryChannels = []
                    if (sendSms) {
                        deliveryChannels.push('SMS')
                    }
                    if (sendEmail) {
                        deliveryChannels.push('EMAIL')
                    }
                    if (deliveryChannels.length) {
                        payload.deliveryChannels = deliveryChannels
                    }
                }

                if (
                    notificationRecipient === 'USER_GROUP' &&
                    userGroupRecipient
                ) {
                    payload.recipientUserGroup = { id: userGroupRecipient }
                }

                if (notificationTrigger === 'SCHEDULED_DAYS') {
                    payload.relativeScheduledDays = parseInt(
                        notificationDays,
                        10
                    )
                    payload.sendStrategy = notificationType
                }

                const { error } = await createModel(payload)

                if (error) {
                    return createFormError(error)
                }

                queryClient.invalidateQueries({
                    queryKey: [{ resource: 'dataSetNotificationTemplates' }],
                })

                navigate(`/${getSectionPath(section)}`)
            } catch (error) {
                return createFormError(error)
            }
        },
        [createModel, navigate, queryClient]
    )
}
