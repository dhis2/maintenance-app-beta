import React from 'react'
import { SectionedFormSections } from '../../../components'
import {
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../lib'
import { BasicInfoFormContents } from './BasicInfoFormContents'
import { OptionSetFormDescriptor } from './formDescriptor'

export const OptionSetFormContents = () => {
    const descriptor = useSectionedFormContext<typeof OptionSetFormDescriptor>()
    useSyncSelectedSectionWithScroll()

    return (
        <SectionedFormSections>
            <BasicInfoFormContents
                name={descriptor.getSection('basicInfo').name}
            />
        </SectionedFormSections>
    )
}
