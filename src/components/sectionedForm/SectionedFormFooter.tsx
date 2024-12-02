import React from 'react'
import css from './SectionForm.module.css'

const SectionedFormFooterFormActions = ({
    children,
}: React.PropsWithChildren) => {
    return <div className={css.formActions}>{children}</div>
}

const SectionedFormFooterSectionActions = ({
    children,
}: React.PropsWithChildren) => {
    return <div className={css.sectionActions}>{children}</div>
}

export const SectionedFormFooter = ({ children }: React.PropsWithChildren) => {
    return <div className={css.footerWrapper}>{children}</div>
}

SectionedFormFooter.FormActions = SectionedFormFooterFormActions
SectionedFormFooter.SectionActions = SectionedFormFooterSectionActions
