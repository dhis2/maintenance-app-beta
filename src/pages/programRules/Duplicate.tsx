import { useQuery } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import { omit } from 'lodash'
import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    DrawerRoot,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../components'
import { DuplicationNoticeBox } from '../../components/form/DuplicationNoticeBox'
import {
    SectionedFormProvider,
    SECTIONS_MAP,
    useBoundResourceQueryFn,
    useOnSubmitNew,
} from '../../lib'
import { fieldFilters, ProgramRuleFormValues } from './form/fieldFilters'
import { ProgramRuleFormDescriptor } from './form/formDescriptor'
import { ProgramRuleFormFields } from './form/ProgramRuleFormFields'
import { validate } from './form/programRuleSchema'

const section = SECTIONS_MAP.programRule

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const query = {
        resource: 'programRules',
        id: duplicatedModelId,
        params: { fields: [...fieldFilters] },
    }
    const programRuleQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<ProgramRuleFormValues>,
    })

    const initialValues = useMemo(
        () => omit(programRuleQuery.data, 'id'),
        [programRuleQuery.data]
    )

    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            modelName={section.name}
            includeAttributes={false}
            validate={validate}
            fetchError={!!programRuleQuery.error}
            subscription={{}}
            mutators={{ ...arrayMutators }}
        >
            {({ handleSubmit }) => (
                <SectionedFormProvider
                    formDescriptor={ProgramRuleFormDescriptor}
                >
                    <SectionedFormLayout
                        sidebar={<DefaultSectionedFormSidebar />}
                    >
                        <DrawerRoot />
                        <form onSubmit={handleSubmit}>
                            <DuplicationNoticeBox section={section} />
                            <ProgramRuleFormFields />
                            <DefaultFormFooter cancelTo="/programRules" />
                        </form>
                        <SectionedFormErrorNotice />
                    </SectionedFormLayout>
                </SectionedFormProvider>
            )}
        </FormBase>
    )
}
