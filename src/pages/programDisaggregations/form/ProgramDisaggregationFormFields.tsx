import React from 'react'
import { SectionedFormSections } from '../../../components'
import { ProgramIndicatorWithMapping } from '../Edit'
import { DisaggregationCategories } from './DissaggregationCategories'
import { ProgramIndicatorMappingSection } from './ProgramIndicatorMappingSection'

export const ProgramDisaggregationFormFields = ({
    initialProgramIndicators,
}: {
    initialProgramIndicators: ProgramIndicatorWithMapping[]
}) => {
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
