import React, { createContext, useState } from 'react'
import { createFormStore, FormProps, FormStore } from './formStore'

export const SectionedFormContext = createContext<FormStore | null>(null)

export const SectionedFormProvider = ({
    children,
    initialValue,
}: {
    initialValue: Partial<FormProps>
    children: React.ReactNode
}) => {
    const [store] = useState(() => createFormStore(initialValue))

    return (
        <SectionedFormContext.Provider value={store}>
            {children}
        </SectionedFormContext.Provider>
    )
}
