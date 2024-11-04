import React, { useEffect, useState } from 'react'
import { SectionedFormSectionProvider } from './SectionedFormSectionContext'
import { createSectionStore } from './sectionStore'
import { SectionedFormSectionContext } from './SectionedFormSectionContext'
import { useRegisterFormSection } from './useRegister'

type SectionFormSectionProps = {
    label: string
    name: string
    children: React.ReactNode
}
export const SectionedFormSection = ({
    label,
    name,
    children,
}: SectionFormSectionProps) => {
    return (
        <SectionedFormSectionProvider
            initialValue={{ section: { name, label } }}
        >
            {children}
        </SectionedFormSectionProvider>
    )
}
