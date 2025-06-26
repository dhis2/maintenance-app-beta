import i18n from '@dhis2/d2-i18n'
import { Button, NoticeBox } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    SectionedFormLayout,
    SectionedFormErrorNotice,
    FormBase,
} from '../../components'
import {
    SectionedFormProvider,
    DEFAULT_FIELD_FILTERS,
    useBoundResourceQueryFn,
} from '../../lib'
import { DataSetNotificationsFormFields } from './form/DataSetNotificationsFormFields'
import { validate } from './form/DataSetNotificationTemplateSchema'
import {
    getInitialValuesFromTemplate,
    DataSetNotificationTemplate,
    DataSetNotificationFormValues,
    transformFormValues,
    formDescriptor,
} from './form/getValues'
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
    'dataSets[id,name,displayName]',
]

export const Component = () => {
    const { id: templateId } = useParams<Params>()
    const queryFn = useBoundResourceQueryFn()

    const {
        data: template,
        isLoading: loadingTemplate,
        isError: errorTemplate,
        refetch: refetchTemplate,
    } = useQuery({
        queryKey: [
            {
                resource: `dataSetNotificationTemplates/${templateId}`,
                params: {
                    fields: fieldFilters.join(','),
                },
            },
        ],
        queryFn: queryFn<DataSetNotificationTemplate>,
        enabled: !!templateId,
    })

    const onSubmit = useOnEditNotifications(templateId as string)

    const handleFormSubmit = async (values: DataSetNotificationFormValues) =>
        onSubmit(transformFormValues(values))

    if (errorTemplate) {
        return (
            <NoticeBox error title={i18n.t('Error')}>
                {i18n.t('Error loading notification template')}
                <br />
                <Button small onClick={() => refetchTemplate()}>
                    {i18n.t('Retry')}
                </Button>
            </NoticeBox>
        )
    }

    if (loadingTemplate || !template) {
        return null
    }

    return (
        <SectionedFormProvider formDescriptor={formDescriptor}>
            <FormBase<DataSetNotificationFormValues>
                onSubmit={handleFormSubmit}
                initialValues={getInitialValuesFromTemplate(template)}
                validate={validate}
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
