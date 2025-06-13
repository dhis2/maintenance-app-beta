import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { useParams } from 'react-router-dom'
import { Form } from 'react-final-form'
import { useDataQuery, useDataEngine } from '@dhis2/app-runtime'
import { useQuery } from '@tanstack/react-query'
import { Button, CircularLoader, NoticeBox } from '@dhis2/ui'

import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    SectionedFormLayout,
} from '../../components'

import {
    SectionedFormProvider,
    SECTIONS_MAP,
    DEFAULT_FIELD_FILTERS,
    useOnSubmitEdit,
} from '../../lib'

import { DataSetNotificationsFormFields } from './form/DataSetNotificationsFormFields'
import {
    getInitialValuesFromTemplate,
    DataSetNotificationTemplate,
    DataSetNotificationFormValues,
} from './form/getInitialValuesFromTemplate'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    "code",
    'subjectTemplate',
    'messageTemplate',
    'notificationRecipient',
    'dataSetNotificationTrigger',
    'relativeScheduledDays',
    'beforeAfter',
    'sendStrategy',
    'recipientUserGroup[id]',
    'dataSets[id,name,displayName]',
    'deliveryChannels',
]

const TEMPLATE_QUERY = {
    notificationTemplate: {
        resource: 'dataSetNotificationTemplates',
        id: ({ id }: { id: string }) => id,
        params: {
            fields: fieldFilters.join(','),
        },
    },
}

const fetchDataSetsByIds = async (engine: any, ids: string[]) => {
    if (!ids.length) return []

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
    const { id: templateId } = useParams<{ id: string }>()
    const section = SECTIONS_MAP.dataSetNotificationTemplate
    const dataEngine = useDataEngine()

    const {
        data: templateResponse,
        loading: loadingTemplate,
        error: errorTemplate,
        refetch: refetchTemplate,
    } = useDataQuery(TEMPLATE_QUERY, {
        variables: { id: templateId },
        lazy: !templateId,
    })

    const template = templateResponse?.notificationTemplate
    const datasetIds =
        template?.dataSets?.map((ds: { id: string }) => ds.id) ?? []

    const {
        data: fetchedDataSets = [],
        isLoading: loadingDataSets,
        isError: errorDataSets,
        refetch: refetchDataSets,
    } = useQuery({
        queryKey: ['datasets', datasetIds],
        queryFn: () => fetchDataSetsByIds(dataEngine, datasetIds),
        enabled: !!template && datasetIds.length > 0,
    })

    const isLoading = loadingTemplate || loadingDataSets
    const isError = errorTemplate || errorDataSets

    const onSubmit = useOnSubmitEdit<DataSetNotificationTemplate>({
        section,
        modelId: templateId!,
    })

    const formDescriptor = {
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
    }

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
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularLoader />
            </div>
        )
    }
    console.log({ fetchedDataSets, template })
    return (
        <SectionedFormProvider formDescriptor={formDescriptor}>
            <Form<DataSetNotificationFormValues>
                onSubmit={onSubmit}
                initialValues={getInitialValuesFromTemplate(
                    template,
                    fetchedDataSets
                )}
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
