import React from 'react'
import css from './SectionForm.module.css'

export type SectionedFormSectionProps = {
    children: React.ReactNode
    name: string
    hidden?: boolean
}

export const SectionedFormSections = ({
    children,
    hidden,
}: React.PropsWithChildren<{ hidden?: boolean }>) => {
    return (
        <div className={css.sections} id="sections" hidden={hidden}>
            {children}
        </div>
    )
}

export const SectionedFormSection = ({
    children,
    name,
    hidden,
}: SectionedFormSectionProps) => {
    return (
        <section id={name} hidden={hidden}>
            {children}
        </section>
    )
}
