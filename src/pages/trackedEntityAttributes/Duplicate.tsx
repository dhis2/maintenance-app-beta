import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
    DefaultSectionedFormSidebar,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../components'
import { DefaultFormFooter } from '../../components/form/DefaultFormFooter'
import { DuplicationNoticeBox } from '../../components/form/DuplicationNoticeBox'
import {
    FEATURES,
    SectionedFormProvider,
    SECTIONS_MAP,
    useFeatureAvailable,
    useOnSubmitNew,
} from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { fieldFilters } from './form/fieldFilters'
import { TrackedEntityAttributeFormDescriptor } from './form/formDescriptor'
import { TrackedEntityAttributeFormContents } from './form/TrackedEntityAttributeFormContents'
import {
    TrackedEntityAttributeFormValues,
    validate,
} from './form/TrackedEntityAttributeFormSchema'

const section = SECTIONS_MAP.trackedEntityAttribute

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string
    const isSearchPerformanceAvailable = useFeatureAvailable(
        FEATURES.searchPerformance
    )
    const formDescriptor = useMemo(() => {
        if (isSearchPerformanceAvailable) {
            return TrackedEntityAttributeFormDescriptor
        }
        return {
            ...TrackedEntityAttributeFormDescriptor,
            sections: TrackedEntityAttributeFormDescriptor.sections.filter(
                (s) => s.name !== 'searchPerformance'
            ),
        }
    }, [isSearchPerformanceAvailable])

    const query = {
        resource: 'trackedEntityAttributes',
        id: duplicatedModelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const trackedEntityAttributeQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<TrackedEntityAttributeFormValues>,
    })

    const initialValues = useMemo(
        () => omit(trackedEntityAttributeQuery.data, 'id'),
        [trackedEntityAttributeQuery.data]
    )

    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            fetchError={!!trackedEntityAttributeQuery.error}
        >
            {({ handleSubmit }) => (
                <SectionedFormProvider formDescriptor={formDescriptor}>
                    <SectionedFormLayout
                        sidebar={<DefaultSectionedFormSidebar />}
                    >
                        <form onSubmit={handleSubmit}>
                            <DuplicationNoticeBox section={section} />
                            <TrackedEntityAttributeFormContents />
                            <DefaultFormFooter />
                        </form>
                        <SectionedFormErrorNotice />
                    </SectionedFormLayout>
                </SectionedFormProvider>
            )}
        </FormBase>
    )
}
