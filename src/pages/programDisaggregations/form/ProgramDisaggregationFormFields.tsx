import { Button } from '@dhis2/ui'
import React from 'react'
import { useFormState } from 'react-final-form'
import { useFieldArray } from 'react-final-form-arrays'
import { SectionedFormSections } from '../../../components'
import { DisaggregationCategories } from './DissaggregationCategories'
import { ProgramIndicatorMappingSection } from './ProgramIndicatorMappingSection'

export const ProgramDisaggregationFormFields = ({
    initialProgramIndicators,
}) => {
    const formState = useFormState()
    const array = useFieldArray('categoryMappings.cX5k9anHEHd')

    console.log({ formState, array })

    return (
        <div>
            <SectionedFormSections>
                <ProgramIndicatorMappingSection
                    initialProgramIndicators={initialProgramIndicators}
                />
                <DisaggregationCategories />
            </SectionedFormSections>
        </div>
    )
}
