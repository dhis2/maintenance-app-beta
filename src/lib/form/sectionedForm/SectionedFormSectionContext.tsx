import React, { createContext, useEffect, useState } from 'react'
import { useStore } from 'zustand'
import { SectionedFormContext } from './SectionedFormContext'
import { createSectionStore, SectionProps, SectionStore } from './sectionStore'

export const SectionedFormSectionContext = createContext<SectionStore | null>(
    null
)

export const SectionedFormSectionProvider = ({
    children,
    initialValue,
}: {
    initialValue: SectionProps
    children: React.ReactNode
}) => {
    const [store] = useState(() => createSectionStore(initialValue))
    const formContext = React.useContext(SectionedFormContext)
    if (!formContext) {
        throw new Error(
            'SectionedFormSectionProvider must be wrapped in a SectionFormSectionProvider'
        )
    }

    const addSectionToForm = useStore(formContext, (state) => state.addSection)

    useEffect(() => {
        addSectionToForm(store.getState().section)
    }, [store, addSectionToForm])

    return (
        <SectionedFormSectionContext.Provider value={store}>
            {children}
        </SectionedFormSectionContext.Provider>
    )
}
