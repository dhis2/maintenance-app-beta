import React from 'react'
import { useFormState } from 'react-final-form'
import { useFieldArray } from 'react-final-form-arrays'
import { ProgramIndicatorMappingSection } from './ProgramIndicatorMappingSection'
import { DisaggregationCategories } from './DissaggregationCategories'

export const ProgramDisaggregationFormFields = () => {
    const formState = useFormState()
    const array = useFieldArray('categoryMappings.cX5k9anHEHd')

    console.log({ formState, array })

    return (
        <div>
            <div>Program Disaggregation Form Fields</div>
            <DisaggregationCategories />
            <ProgramIndicatorMappingSection />
        </div>
    )
}

