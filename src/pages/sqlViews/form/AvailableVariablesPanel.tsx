import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import styles from '../../../components/MessageFields/MessageFields.module.css'

const BUILT_IN_VARIABLES: { token: string; description: string }[] = [
    {
        token: '${_current_user_id}',
        description: i18n.t('Current user ID'),
    },
    {
        token: '${_current_username}',
        description: i18n.t('Current username'),
    },
]

type Props = {
    fieldName: string
    editorRef: React.RefObject<HTMLTextAreaElement>
}

const insertAtCursor = (
    textarea: HTMLTextAreaElement | null,
    insert: string,
    onChange: (next: string) => void
) => {
    if (!textarea) {
        return
    }
    const start = textarea.selectionStart ?? textarea.value.length
    const end = textarea.selectionEnd ?? textarea.value.length
    const next =
        textarea.value.slice(0, start) + insert + textarea.value.slice(end)
    onChange(next)
    requestAnimationFrame(() => {
        textarea.focus()
        const cursor = start + insert.length
        textarea.setSelectionRange(cursor, cursor)
    })
}

export const AvailableVariablesPanel = ({ fieldName, editorRef }: Props) => {
    const { input } = useField<string>(fieldName)
    return (
        <aside aria-label={i18n.t('Available variables')}>
            <div className={styles.templateVariablesText}>
                {i18n.t('Insert a variable:', { nsSeparator: '~:~' })}
            </div>
            {BUILT_IN_VARIABLES.map((variable) => (
                <div key={variable.token} className={styles.variableButton}>
                    <Button
                        secondary
                        small
                        onClick={() =>
                            insertAtCursor(
                                editorRef.current,
                                variable.token,
                                input.onChange
                            )
                        }
                    >
                        {variable.description}
                    </Button>
                </div>
            ))}
        </aside>
    )
}
