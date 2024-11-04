import React, { useCallback } from 'react'
import { useStore } from 'zustand'
import { SectionedFormContext } from './SectionedFormContext'
import { SectionedFormSectionContext } from './SectionedFormSectionContext'
import { SectionFormField } from './types'

export const useRegisterField = () => {
    const sectionContext = React.useContext(SectionedFormSectionContext)!
    const formContext = React.useContext(SectionedFormContext)!

    const currentSection = useStore(sectionContext, (state) =>
        state.getSection()
    )

    const addFieldToForm = useStore(formContext, (state) => state.addField)

    return useCallback(
        (field: SectionFormField) => {
            if (currentSection) {
                addFieldToForm(currentSection, field)
            } else {
                console.error(`Tried to register field ${field.name} in section, but no section is set.
Make sure to wrap fields in a SectionedFormSection component`)
            }
        },
        [addFieldToForm, currentSection]
    )
}
