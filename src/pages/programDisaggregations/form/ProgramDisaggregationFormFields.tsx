import React, { useCallback, useState } from 'react'
import { SectionedFormSections } from '../../../components'
import { ProgramIndicatorWithMapping } from '../Edit'
import { DisaggregationCategories } from './DissaggregationCategories'
import { ProgramIndicatorMappingSection } from './ProgramIndicatorMappingSection'

export const ProgramDisaggregationFormFields = ({
    initialProgramIndicators,
}: {
    initialProgramIndicators: ProgramIndicatorWithMapping[]
}) => {
    const [invalidStates, setInvalidStates] = useState<Record<string, boolean>>({})

    const handleValidationChange = useCallback(
        (fieldName: string, isInvalid: boolean) => {
            setInvalidStates((prev) => ({
                ...prev,
                [fieldName]: isInvalid,
            }))
        },
        []
    )
    
    return (
        <div>
            <SectionedFormSections>
                <ProgramIndicatorMappingSection
                    initialProgramIndicators={initialProgramIndicators}
                    invalidStates={invalidStates}
                />
                <DisaggregationCategories
                    invalidStates={invalidStates}
                    handleValidationChange={handleValidationChange}
                />
            </SectionedFormSections>
        </div>
    )
}
