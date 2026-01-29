import React from 'react'
import { getSectionPath } from '../../lib'
import { ModelSection } from '../../types'
import { StandardFormSection } from '../standardForm'
import classes from './DefaultFormContents.module.css'
import { DefaultFormErrorNotice } from './DefaultFormErrorNotice'
import { DefaultFormFooter } from './DefaultFormFooter'
import { TranslatedFieldsNoticeBox } from './TranslatedFieldsNoticeBox'

type DefaultFormContentsProps = {
    readonly children: React.ReactNode
    readonly section: ModelSection
}

function DefaultFormContents({
    children,
    section,
    showTranslatedFieldsNotice = false,
}: DefaultFormContentsProps & {
    readonly showTranslatedFieldsNotice?: boolean
}) {
    const listPath = `/${getSectionPath(section)}`

    return (
        <>
            <div className={classes.form}>
                {showTranslatedFieldsNotice && <TranslatedFieldsNoticeBox />}
                {children}
                <StandardFormSection>
                    <DefaultFormErrorNotice />
                </StandardFormSection>
            </div>
            <DefaultFormFooter cancelTo={listPath} />
        </>
    )
}

export function DefaultEditFormContents(
    props: Readonly<DefaultFormContentsProps>
) {
    return <DefaultFormContents {...props} showTranslatedFieldsNotice={true} />
}

export function DefaultNewFormContents(
    props: Readonly<DefaultFormContentsProps>
) {
    return <DefaultFormContents {...props} showTranslatedFieldsNotice={false} />
}
