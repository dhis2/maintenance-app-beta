import React from 'react'
import { SectionedFormProvider } from './SectionedFormContext'

type SectionedFormProps = {
    name: string
    children: React.ReactNode
}
export const SectionedFormBase = ({ name, children }: SectionedFormProps) => {
    return (
        <SectionedFormProvider initialValue={{ name }}>
            {children}
        </SectionedFormProvider>
    )
}
