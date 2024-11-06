import React from 'react'
import css from './SectionedFormLayout.module.css'

export type SectionedFormLayoutProps = {
    children: React.ReactNode
    footer: React.ReactNode
    sidebar: React.ReactNode
}
export const SectionedFormLayout = ({
    children,
    footer,
    sidebar,
}: SectionedFormLayoutProps) => {
    return (
        <div className={css.layoutWrapper}>
            <div className={css.wrapper}>
                <div className={css.sidebar}>{sidebar}</div>
                <div className={css.main}>{children}</div>
                <div className={css.footer}>{footer}</div>
            </div>
        </div>
    )
}
