import React from 'react'
import {
    CustomAttributesSection,
    SectionedFormSections,
} from '../../../components'
import {
    SECTIONS_MAP,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../lib'
import { BasicInfoFormContents } from './BasicInfoFormContents'
import { OptionSetFormDescriptor } from './formDescriptor'
import { OptionsListFormContents } from './optionsList/OptionsListFormContents'

export const OptionSetFormContents = () => {
    const descriptor = useSectionedFormContext<typeof OptionSetFormDescriptor>()
    useSyncSelectedSectionWithScroll()

    return (
        <SectionedFormSections>
            <BasicInfoFormContents
                name={descriptor.getSection('basicInfo').name}
            />
            <OptionsListFormContents
                name={descriptor.getSection('options').name}
            />
            <CustomAttributesSection
                schemaSection={SECTIONS_MAP.optionSet}
                sectionedLayout
            />
        </SectionedFormSections>
    )
}
