import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React from 'react'
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

const section = SECTIONS_MAP.validationRule

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const query = {
        resource: 'validationRules',
        id: duplicatedModelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const validationRuleQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<ValidationRuleFormValues>,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={omit(validationRuleQuery.data, 'id')}
            validate={validate}
            fetchError={!!validationRuleQuery.error}
        >
            {({ handleSubmit }) => (
                <SectionedFormProvider
                    formDescriptor={ValidationRuleFormDescriptor}
                >
                    <SectionedFormLayout
                        sidebar={<DefaultSectionedFormSidebar />}
                    >
                        <form onSubmit={handleSubmit}>
                            <DuplicationNoticeBox section={section} />
                            <ValidationRuleFormFields />
                            <DefaultFormFooter cancelTo="/validationRules" />
                        </form>
                        <SectionedFormErrorNotice />
                    </SectionedFormLayout>
                </SectionedFormProvider>
            )}
        </FormBase>
    )
}
