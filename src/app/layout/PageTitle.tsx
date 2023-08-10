import React, { PropsWithChildren } from 'react'
import css from './Layout.module.css'

export const PageTitle = ({ children }: PropsWithChildren) => {
    return <div className={css.pageTitle}>{children}</div>
}
