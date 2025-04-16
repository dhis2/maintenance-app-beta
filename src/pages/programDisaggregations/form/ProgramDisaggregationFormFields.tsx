import React from 'react'
import { useFormState } from 'react-final-form'
import { useFieldArray } from 'react-final-form-arrays'
import { DisaggregationCategories } from './DissaggregationCategories'
import { ProgramIndicatorMappingSection } from './ProgramIndicatorMappingSection'

export const ProgramDisaggregationFormFields = () => {
    const formState = useFormState()
    const array = useFieldArray('categoryMappings.cX5k9anHEHd')

    console.log({ formState, array })

    return (
        <div>
            <DisaggregationCategories />
            <ProgramIndicatorMappingSection />
        </div>
    )
}
