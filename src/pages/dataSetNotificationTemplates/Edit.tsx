import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, NoticeBox } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    SectionedFormLayout,
    SectionedFormErrorNotice,
    FormBase,
} from '../../components'
import { SectionedFormProvider, DEFAULT_FIELD_FILTERS } from '../../lib'
import { DataSetNotificationsFormFields } from './form/DataSetNotificationsFormFields'
import {
    getInitialValuesFromTemplate,
    DataSetNotificationTemplate,
    DataSetNotificationFormValues,
    transformFormValues,
} from './form/getInitialValuesFromTemplate'
import { useOnEditNotifications } from './form/useOnEditNotifications'

type Params = {
    id: string
}

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'code',
    'subjectTemplate',
    'messageTemplate',
    'notificationRecipient',
    'dataSetNotificationTrigger',
    'relativeScheduledDays',
    'sendStrategy',
    'recipientUserGroup',
    'deliveryChannels',
    'dataSets[id,name,displayName]', // fetch full info here
]

const fetchNotificationTemplate = async (
    engine: any,
    id: string
): Promise<DataSetNotificationTemplate> => {
    const { notificationTemplate } = await engine.query({
        notificationTemplate: {
            resource: `dataSetNotificationTemplates/${id}`,
            params: {
                fields: fieldFilters.join(','),
            },
        },
    })
    return notificationTemplate
}

export const Component = () => {
    const { id: templateId } = useParams<Params>()
    const dataEngine = useDataEngine()

    const {
        data: template,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['notificationTemplate', templateId],
        queryFn: () =>
            fetchNotificationTemplate(dataEngine, templateId as string),
        enabled: !!templateId,
    })

    const onSubmit = useOnEditNotifications(templateId as string)

    const handleFormSubmit = async (values: DataSetNotificationFormValues) =>
        onSubmit(transformFormValues(values))

    const formDescriptor = useMemo(
        () => ({
            name: 'editDataSetNotificationForm',
            label: i18n.t('Edit Data Set Notification'),
            sections: [
                {
                    name: 'whatToSend',
                    label: i18n.t('What to send'),
                    fields: [{ name: 'name', label: i18n.t('Name') }],
                },
                {
                    name: 'whenToSend',
                    label: i18n.t('When to send it'),
                    fields: [
                        {
                            name: 'dataSetNotificationTrigger',
                            label: i18n.t('Notification trigger'),
                        },
                    ],
                },
                {
                    name: 'whoToSend',
                    label: i18n.t('Who to send it to'),
                    fields: [
                        {
                            name: 'notificationRecipient',
                            label: i18n.t('Recipient'),
                        },
                    ],
                },
            ],
        }),
        []
    )

    if (isError) {
        return (
            <NoticeBox error title={i18n.t('Error')}>
                {i18n.t('Error loading notification template')}
                <br />
                <Button small onClick={() => refetch()}>
                    {i18n.t('Retry')}
                </Button>
            </NoticeBox>
        )
    }

    if (isLoading || !template) {
        return null
    }

    return (
        <SectionedFormProvider formDescriptor={formDescriptor}>
            <FormBase<DataSetNotificationFormValues>
                onSubmit={handleFormSubmit}
                initialValues={getInitialValuesFromTemplate(template)}
                includeAttributes={false}
            >
                {({ handleSubmit }) => (
                    <SectionedFormLayout
                        sidebar={<DefaultSectionedFormSidebar />}
                    >
                        <form onSubmit={handleSubmit}>
                            <DataSetNotificationsFormFields />
                            <SectionedFormErrorNotice />
                        </form>
                        <DefaultFormFooter />
                    </SectionedFormLayout>
                )}
            </FormBase>
        </SectionedFormProvider>
    )
}
