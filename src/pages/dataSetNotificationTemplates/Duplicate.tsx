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
} from '../../components'
import { DuplicationNoticeBox } from '../../components/form/DuplicationNoticeBox'
import {
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
    'notifyUsersInHierarchyOnly',
] as const

export const Component = () => {
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const queryFn = useBoundResourceQueryFn()
    const section = SECTIONS_MAP.dataSetNotificationTemplate
    const { data: template } = useQuery({
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

    const initialValues = useMemo(
        () => (template ? omit(template, 'id') : undefined),
        [template]
    )

    return (
        <FormBase
            onSubmit={useOnSubmitNew({
                section: SECTIONS_MAP.dataSetNotificationTemplate,
            })}
            initialValues={initialValues}
            validate={validate}
            valueFormatter={transformFormValues}
            includeAttributes={false}
            fetchError={!!template}
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
