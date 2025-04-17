import React from 'react'
import { useFormState } from 'react-final-form'
import { useFieldArray } from 'react-final-form-arrays'
import { SectionedFormSections } from '../../../components'
import { ProgramIndicatorWithMapping } from '../Edit'
import { UseQueryResult } from '@tanstack/react-query'
import { DisaggregationCategories } from './DissaggregationCategories'
import { ProgramIndicatorMappingSection } from './ProgramIndicatorMappingSection'
import { ProgramData, ProgramIndicatorData } from '../Edit'

export const ProgramDisaggregationFormFields = ({
    initialProgramIndicators,
}: {
    initialProgramIndicators: ProgramIndicatorWithMapping[],
}) => {
    const formState = useFormState()
    const array = useFieldArray('categoryMappings.cX5k9anHEHd')

    return (
        <div>
            <SectionedFormSections>
                <ProgramIndicatorMappingSection
                    initialProgramIndicators={initialProgramIndicators}
                />
                <DisaggregationCategories/>
            </SectionedFormSections>
        </div>
    )
}
