import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
    DuplicationNoticeBox,
} from '../../components'
import {
    DEFAULT_FIELD_FILTERS,
    getSectionPath,
    SectionedFormProvider,
    SECTIONS_MAP,
    useBoundResourceQueryFn,
    useOnSubmitNew,
} from '../../lib'
import { DataSetNotificationResult } from './Edit'
import { DataSetNotificationsFormFields } from './form/DataSetNotificationsFormFields'
import {
    transformFormValues,
    validate,
} from './form/dataSetNotificationTemplateSchema'
import { formDescriptor } from './form/formDescriptor'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'displayName',
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
    'notifyUsersInHierarchyOnly',
] as const

export const Component = () => {
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const queryFn = useBoundResourceQueryFn()
    const section = SECTIONS_MAP.dataSetNotificationTemplate
    const template = useQuery({
        queryKey: [
            {
                resource: 'dataSetNotificationTemplates',
                id: duplicatedModelId,
                params: {
                    fields: fieldFilters.join(','),
                },
            },
        ],
        queryFn: queryFn<DataSetNotificationResult>,
        enabled: !!duplicatedModelId,
    })

    const onSubmit = useOnSubmitNew<Omit<DataSetNotificationResult, 'id'>>({
        section: SECTIONS_MAP.dataSetNotificationTemplate,
    })

    const initialValues = useMemo(
        () => (template.data ? omit(template.data, 'id') : undefined),
        [template.data]
    )

    return (
        <FormBase
            onSubmit={onSubmit}
            initialValues={initialValues}
            validate={validate}
            valueFormatter={transformFormValues}
            includeAttributes={false}
            fetchError={!!template.error}
        >
            {({ handleSubmit }) => (
                <SectionedFormProvider formDescriptor={formDescriptor}>
                    <SectionedFormLayout
                        sidebar={<DefaultSectionedFormSidebar />}
                    >
                        <DuplicationNoticeBox section={section} />
                        <form onSubmit={handleSubmit}>
                            <DataSetNotificationsFormFields />
                            <SectionedFormErrorNotice />
                        </form>
                        <DefaultFormFooter
                            cancelTo={`/${getSectionPath(section)}`}
                        />
                    </SectionedFormLayout>
                </SectionedFormProvider>
            )}
        </FormBase>
    )
}
