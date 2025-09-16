import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import {
    DEFAULT_FIELD_FILTERS,
    SECTIONS_MAP,
    useOnSubmitEdit,
    getSectionPath,
} from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PickWithFieldFilters } from '../../types/generated'
import { ValidationNotificationTemplate } from '../../types/models'
import { ValidationNotificationTemplateFormFields, validate } from './form'
import { SectionedFormWrapper } from './SectionedFormWrapper'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'code',
    'validationRules[id,displayName]',
    'sendStrategy',
    'subjectTemplate',
    'messageTemplate',
    'recipientUserGroups[id,displayName]',
    'notifyUsersInHierarchyOnly',
] as const

export type ValidationNotificationTemplateFormValues = PickWithFieldFilters<
    ValidationNotificationTemplate,
    typeof fieldFilters
>

export const Component = () => {
    const section = SECTIONS_MAP.validationNotificationTemplate
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string
    const query = {
        resource: 'validationNotificationTemplates',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const validationNotificationTemplatesQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<ValidationNotificationTemplateFormValues>,
    })

    return (
        <SectionedFormWrapper
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={validationNotificationTemplatesQuery.data}
            validate={validate}
            cancelTo={`/${getSectionPath(section)}`}
        >
            <ValidationNotificationTemplateFormFields
                initialValues={validationNotificationTemplatesQuery.data ?? {}}
            />
        </SectionedFormWrapper>
    )
}
