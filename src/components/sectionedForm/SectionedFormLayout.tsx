import React from 'react'
import css from './SectionedFormLayout.module.css'

export type SectionedFormLayoutProps = {
    children: React.ReactNode
    footer?: React.ReactNode
    sidebar?: React.ReactNode
}
export const SectionedFormLayout = ({
    children,
    footer,
    sidebar,
}: SectionedFormLayoutProps) => {
    return (
        <div className={css.layoutWrapper}>
            <div className={css.layoutGrid}>
                <SectionedFormLayoutSidebar>
                    {sidebar}
                </SectionedFormLayoutSidebar>
                <SectionedFormLayoutFooter>{footer}</SectionedFormLayoutFooter>
                <SectionedFormLayoutMain>{children}</SectionedFormLayoutMain>
            </div>
        </div>
    )
}

const SectionedFormLayoutSidebar = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return <div className={css.sidebar}>{children}</div>
}
const SectionedFormLayoutMain = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return <div className={css.main}>{children}</div>
}
const SectionedFormLayoutFooter = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return <div className={css.footer}>{children}</div>
}

SectionedFormLayout.Sidebar = SectionedFormLayoutSidebar
SectionedFormLayout.Main = SectionedFormLayoutMain
SectionedFormLayout.Footer = SectionedFormLayoutFooter
