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
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    DEFAULT_FIELD_FILTERS,
    SectionedFormProvider,
    SECTIONS_MAP,
    useOnSubmitNew,
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
    'trackedEntityTypeAttributes[trackedEntityAttribute[id,displayName,unique,valueType],mandatory,searchable,displayInList]',
] as const

type TrackedEntityTypeFormValues = PickWithFieldFilters<
    TrackedEntityType,
    typeof fieldFilters
> & { id: string }

const section = SECTIONS_MAP.trackedEntityType

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const query = {
        resource: 'trackedEntityTypes',
        id: duplicatedModelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const trackedEntityTypeQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<TrackedEntityTypeFormValues>,
    })

    const initialValues = useMemo(
        () => omit(trackedEntityTypeQuery.data, 'id'),
        [trackedEntityTypeQuery.data]
    )

    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validateTrackedEntityType}
            fetchError={!!trackedEntityTypeQuery.error}
        >
            {({ handleSubmit }) => (
                <SectionedFormProvider
                    formDescriptor={TrackedEntityTypeFormDescriptor}
                >
                    <SectionedFormLayout
                        sidebar={<DefaultSectionedFormSidebar />}
                    >
                        <form onSubmit={handleSubmit}>
                            <DuplicationNoticeBox section={section} />
                            <TrackedEntityTypeFormFields />
                            <DefaultFormFooter cancelTo="/trackedEntityTypes" />
                        </form>
                        <SectionedFormErrorNotice />
                    </SectionedFormLayout>
                </SectionedFormProvider>
            )}
        </FormBase>
    )
}
