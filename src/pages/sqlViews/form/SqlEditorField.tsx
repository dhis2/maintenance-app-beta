import { TextAreaFieldFF } from '@dhis2/ui'
import React, { useEffect, useRef } from 'react'
import { Field as FieldRFF } from 'react-final-form'
import css from './SqlEditorField.module.css'

type Props = {
    name: string
    label: string
    helpText?: string
    required?: boolean
    minRows?: number
    editorRef?: React.RefObject<HTMLTextAreaElement>
    rightAddon?: React.ReactNode
}

export const SqlEditorField = ({
    name,
    label,
    helpText,
    required,
    minRows = 12,
    editorRef,
    rightAddon,
}: Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!editorRef) {
            return
        }

        const mutableEditorRef =
            editorRef as React.MutableRefObject<HTMLTextAreaElement | null>
        mutableEditorRef.current =
            wrapperRef.current?.querySelector('textarea') ?? null

        return () => {
            mutableEditorRef.current = null
        }
    }, [editorRef])

    return (
        <div className={css.editorRow}>
            <div ref={wrapperRef} className={css.editor}>
                <FieldRFF<string | undefined>
                    component={TextAreaFieldFF}
                    name={name}
                    label={label}
                    required={required}
                    helpText={helpText}
                    rows={minRows}
                    resize="vertical"
                    inputWidth="100%"
                    dataTest={`formfields-${name}`}
                />
            </div>
            {rightAddon && <div className={css.rightAddon}>{rightAddon}</div>}
        </div>
    )
}
