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
    DEFAULT_FIELD_FILTERS,
    SectionedFormProvider,
    SECTIONS_MAP,
    useOnSubmitEdit,
} from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PickWithFieldFilters, Predictor } from '../../types/generated'
import { PredictorFormDescriptor } from './form/formDescriptor'
import { PredictorFormFields } from './form/PredictorFormFields'
import { validate } from './form/predictorSchema'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'description',
    'periodType',
    'output',
    'outputCombo',
    'organisationUnitDescendants',
    'sequentialSampleCount',
    'annualSampleCount',
    'sequentialSkipCount',
    'generator',
    'sampleSkipTest',
    'organisationUnitLevels[id,displayName]',
] as const

export type PredictorFormValues = PickWithFieldFilters<
    Predictor,
    typeof fieldFilters
> & { id: string }

export const Component = () => {
    const modelId = useParams().id as string
    const section = SECTIONS_MAP.predictor
    const queryFn = useBoundResourceQueryFn()

    const query = {
        resource: 'predictors',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }

    const predictorQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<PredictorFormValues>,
    })
    const initialValues = predictorQuery.data

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={initialValues}
            validate={validate}
            subscription={{}}
            includeAttributes={false}
        >
            {({ handleSubmit }) => {
                return (
                    <SectionedFormProvider
                        formDescriptor={PredictorFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <form onSubmit={handleSubmit}>
                                <PredictorFormFields />
                                <DefaultFormFooter cancelTo="/predictors" />
                            </form>
                            <SectionedFormErrorNotice />
                        </SectionedFormLayout>
                    </SectionedFormProvider>
                )
            }}
        </FormBase>
    )
}
