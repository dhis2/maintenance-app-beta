import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    SectionedFormSection,
    SectionedFormSections,
    StandardFormSectionTitle,
} from '../../../components'
import { ProgramIndicatorWithMapping } from '../Edit'
import { CategoryMappingSection } from './CategoryMappingSection'
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
                <SectionedFormSection name="disaggregationCategories">
                    <StandardFormSectionTitle>
                        {i18n.t('Disaggregation categories')}
                    </StandardFormSectionTitle>
                    <CategoryMappingSection
                        dataDimensionType={'DISAGGREGATION'}
                    />
                </SectionedFormSection>
                <SectionedFormSection name="attributeCategories">
                    <StandardFormSectionTitle>
                        {i18n.t('Attribute categories')}
                    </StandardFormSectionTitle>
                    <CategoryMappingSection dataDimensionType={'ATTRIBUTE'} />
                </SectionedFormSection>
            </SectionedFormSections>
        </div>
    )
}
