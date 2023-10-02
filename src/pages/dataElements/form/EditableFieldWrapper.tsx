import { Button } from '@dhis2/ui'
import React from 'react'
import classes from './EditableFieldWrapper.module.css'

export function EditableFieldWrapper({
    children,
    dataTest,
    onRefresh,
    onAddNew,
}: {
    children: React.ReactNode
    dataTest?: string
    onRefresh: (e: React.MouseEvent<HTMLButtonElement>) => void
    onAddNew: (e: React.MouseEvent<HTMLButtonElement>) => void
}) {
    return (
        <div data-test={dataTest} className={classes.editableFieldWrapper}>
            <div>{children}</div>

            <div className={classes.actions}>
                <Button small onClick={onRefresh}>
                    Refresh
                </Button>
                <Button small onClick={onAddNew}>
                    Add new
                </Button>
            </div>
        </div>
    )
}
