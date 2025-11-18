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
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    DEFAULT_FIELD_FILTERS,
    SectionedFormProvider,
    SECTIONS_MAP,
    useOnSubmitEdit,
    useBoundResourceQueryFn,
} from '../../lib'
import { PickWithFieldFilters, TrackedEntityType } from '../../types/generated'
import {
    TrackedEntityTypeFormDescriptor,
    TrackedEntityTypeFormFields,
    validateTrackedEntityType,
} from './form'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'shortName',
    'description',
    'style[color,icon]',
    'allowAuditLog',
    'minAttributesRequiredToSearch',
    'maxTeiCountToReturn',
    'featureType',
    'trackedEntityTypeAttributes[trackedEntityAttribute[id,displayName,unique],mandatory,searchable,displayInList]',
] as const

export type TrackedEntityTypeFormValues = PickWithFieldFilters<
    TrackedEntityType,
    typeof fieldFilters
> & { id: string }

export const Component = () => {
    const section = SECTIONS_MAP.trackedEntityType
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string

    const query = {
        resource: 'trackedEntityTypes',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const trackedEntityType = useQuery({
        queryKey: [query],
        queryFn: queryFn<TrackedEntityTypeFormValues>,
    })
    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ modelId, section })}
            initialValues={trackedEntityType.data}
            validate={validateTrackedEntityType}
        >
            {({ handleSubmit }) => {
                return (
                    <SectionedFormProvider
                        formDescriptor={TrackedEntityTypeFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <form onSubmit={handleSubmit}>
                                <TrackedEntityTypeFormFields />
                                <DefaultFormFooter cancelTo="/trackedEntityTypes" />
                            </form>
                            <SectionedFormErrorNotice />
                        </SectionedFormLayout>
                    </SectionedFormProvider>
                )
            }}
        </FormBase>
    )
}
