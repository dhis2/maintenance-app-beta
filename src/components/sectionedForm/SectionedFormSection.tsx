import React from 'react'
import { useSelectedSection } from '../../lib'

export type SectionedFormSectionProps = {
    children: React.ReactNode
    active: boolean
}

export const SectionedFormSection = ({
    children,
    active,
}: SectionedFormSectionProps) => {
    if (!active) {
        return null
    }
    return <div> {children}</div>
}
