import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader, NoticeBox } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Form } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    SectionedFormLayout,
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
    'dataSets',
    'deliveryChannels',
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

const fetchDataSetsByIds = async (engine: any, ids: string[]) => {
    if (!ids.length) {
        return []
    }
    const { dataSets } = await engine.query({
        dataSets: {
            resource: 'dataSets',
            params: {
                fields: 'id,name,displayName',
                filter: `id:in:[${ids.join(',')}]`,
            },
        },
    })
    return dataSets ?? []
}

export const Component = () => {
    const { id: templateId } = useParams<Params>()
    const dataEngine = useDataEngine()
    const alert = useAlert(
        ({ message }) => message,
        (options) => options
    )

    const {
        data: template,
        isLoading: loadingTemplate,
        isError: errorTemplate,
        refetch: refetchTemplate,
    } = useQuery({
        queryKey: ['notificationTemplate', templateId],
        queryFn: () =>
            fetchNotificationTemplate(dataEngine, templateId as string),
        enabled: !!templateId,
    })

    const datasetIds = useMemo(
        () => template?.dataSets?.map((ds) => ds.id) ?? [],
        [template]
    )

    const {
        data: fetchedDataSets,
        isLoading: loadingDataSets,
        isError: errorDataSets,
        refetch: refetchDataSets,
    } = useQuery({
        queryKey: ['datasets', datasetIds],
        queryFn: () => fetchDataSetsByIds(dataEngine, datasetIds),
        enabled: datasetIds.length > 0,
    })

    const isLoading = loadingTemplate ?? loadingDataSets
    const isError = errorTemplate ?? errorDataSets
    const onSubmit = useOnEditNotifications(templateId as string)

    const handleFormSubmit = async (values: DataSetNotificationFormValues) => {
        const result = await onSubmit(transformFormValues(values))
        if (
            result &&
            typeof result === 'object' &&
            'FINAL_FORM/form-error' in result
        ) {
            const formError = (result as { 'FINAL_FORM/form-error': any })[
                'FINAL_FORM/form-error'
            ]

            alert.show({
                message: i18n.t('Error: {{message}}', {
                    message: formError?.original?.message ?? formError.message,
                }),
                error: true,
            })
        }
    }

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
            <NoticeBox title={i18n.t('Error')} error>
                {i18n.t('Error loading notification template or datasets')}
                <br />
                <Button
                    small
                    onClick={() => {
                        refetchTemplate()
                        refetchDataSets()
                    }}
                >
                    {i18n.t('Retry')}
                </Button>
            </NoticeBox>
        )
    }

    if (isLoading || !template) {
        return (
            <div style={{ height: '100%' }}>
                <CircularLoader />
            </div>
        )
    }

    return (
        <SectionedFormProvider formDescriptor={formDescriptor}>
            <Form
                onSubmit={handleFormSubmit}
                initialValues={getInitialValuesFromTemplate(
                    template,
                    fetchedDataSets?.dataSets
                )}
                destroyOnUnregister={true}
            >
                {({ handleSubmit }) => (
                    <SectionedFormLayout
                        sidebar={<DefaultSectionedFormSidebar />}
                    >
                        <form onSubmit={handleSubmit}>
                            <DataSetNotificationsFormFields />
                        </form>
                        <DefaultFormFooter />
                    </SectionedFormLayout>
                )}
            </Form>
        </SectionedFormProvider>
    )
}
