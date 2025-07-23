import i18n from '@dhis2/d2-i18n'
import { Button, NoticeBox } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../components'
import {
    SectionedFormProvider,
    DEFAULT_FIELD_FILTERS,
    useBoundResourceQueryFn,
    useOnSubmitEdit,
    SECTIONS_MAP,
} from '../../lib'
import { DataSetNotificationTemplate } from '../../types/generated'
import { DataSetNotificationsFormFields } from './form/DataSetNotificationsFormFields'
import {
    DataSetNotificationFormValues,
    validate,
} from './form/dataSetNotificationTemplateSchema'
import { transformFormValues, formDescriptor } from './form/getValues'

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
    const { id: templateId } = useParams<{ id: string }>()
    const queryFn = useBoundResourceQueryFn()

    const {
        data: template,
        isLoading,
        isError,
        refetch,
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

    const onSubmit = useOnSubmitEdit<DataSetNotificationFormValues>({
        modelId: templateId as string,
        section: SECTIONS_MAP.dataSetNotificationTemplate,
    })

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
        <FormBase<DataSetNotificationFormValues>
            onSubmit={onSubmit}
            initialValues={template as unknown as DataSetNotificationFormValues}
            validate={validate}
            valueFormatter={transformFormValues}
            includeAttributes={false}
        >
            {({ handleSubmit }) => (
                <SectionedFormProvider formDescriptor={formDescriptor}>
                    <SectionedFormLayout
                        sidebar={<DefaultSectionedFormSidebar />}
                    >
                        <form onSubmit={handleSubmit}>
                            <DataSetNotificationsFormFields />
                            <SectionedFormErrorNotice />
                        </form>
                        <DefaultFormFooter />
                    </SectionedFormLayout>
                </SectionedFormProvider>
            )}
        </FormBase>
    )
}
