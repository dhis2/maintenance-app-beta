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
import {
    DataSetNotificationTemplate,
    PickWithFieldFilters,
} from '../../types/generated'
import { DataSetNotificationsFormFields } from './form/DataSetNotificationsFormFields'
import {
    transformFormValues,
    validate,
} from './form/dataSetNotificationTemplateSchema'
import { formDescriptor } from './form/formDescriptor'

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
    'recipientUserGroup[id,displayName]',
    'deliveryChannels',
    'dataSets[id,name,displayName]',
] as const

type DataSetNotificationResult = PickWithFieldFilters<
    DataSetNotificationTemplate,
    typeof fieldFilters
>

export const Component = () => {
    const { id: templateId } = useParams<{ id: string }>()
    const queryFn = useBoundResourceQueryFn()

    const {
        data: template,
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
        queryFn: queryFn<DataSetNotificationResult>,
        enabled: !!templateId,
    })

    const onSubmit = useOnSubmitEdit({
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

    return (
        <FormBase
            valueFormatter={transformFormValues}
            onSubmit={onSubmit}
            initialValues={template}
            validate={validate}
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
