import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DuplicationNoticeBox } from '../../components/form/DuplicationNoticeBox'
import {
    DEFAULT_FIELD_FILTERS,
    SECTIONS_MAP,
    useOnSubmitNew,
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

type ValidationNotificationTemplateFormValues = PickWithFieldFilters<
    ValidationNotificationTemplate,
    typeof fieldFilters
>

const section = SECTIONS_MAP.validationNotificationTemplate

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const query = {
        resource: 'validationNotificationTemplates',
        id: duplicatedModelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const validationNotificationTemplateQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<ValidationNotificationTemplateFormValues>,
    })

    const initialValues = useMemo(
        () =>
            omit(
                validationNotificationTemplateQuery.data,
                'id'
            ) as ValidationNotificationTemplate,
        [validationNotificationTemplateQuery.data]
    )

    return (
        <SectionedFormWrapper
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            cancelTo={`/${getSectionPath(section)}`}
            fetchError={!!validationNotificationTemplateQuery.error}
        >
            <>
                <DuplicationNoticeBox section={section} />
                <ValidationNotificationTemplateFormFields />
            </>
        </SectionedFormWrapper>
    )
}
