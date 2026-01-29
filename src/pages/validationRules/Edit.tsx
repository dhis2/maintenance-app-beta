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
} from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PickWithFieldFilters, ValidationRule } from '../../types/generated'
import { ValidationRuleFormDescriptor } from './form/formDescriptor'
import ValidationRuleFormFields from './form/ValidationRuleFormFields'
import { validate } from './form/validationRuleSchema'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'description',
    'leftSide[expression,description,missingValueStrategy,slidingWindow]',
    'operator',
    'rightSide[expression,description,missingValueStrategy,slidingWindow]',
    'instruction',
    'periodType',
    'importance',
    'skipFormValidation',
    'organisationUnitLevels',
] as const

export type ValidationRuleFormValues = PickWithFieldFilters<
    ValidationRule,
    typeof fieldFilters
> & { id: string }

export const Component = () => {
    const modelId = useParams().id as string
    const section = SECTIONS_MAP.validationRule
    const queryFn = useBoundResourceQueryFn()

    const query = {
        resource: 'validationRules',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }

    const validationRuleQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<ValidationRuleFormValues>,
    })
    const initialValues = validationRuleQuery.data

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={initialValues}
            validate={validate}
            subscription={{}}
        >
            {({ handleSubmit }) => {
                return (
                    <SectionedFormProvider
                        formDescriptor={ValidationRuleFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <form onSubmit={handleSubmit}>
                                <ValidationRuleFormFields />
                                <DefaultFormFooter cancelTo="/validationRules" />
                            </form>
                            <SectionedFormErrorNotice />
                        </SectionedFormLayout>
                    </SectionedFormProvider>
                )
            }}
        </FormBase>
    )
}
