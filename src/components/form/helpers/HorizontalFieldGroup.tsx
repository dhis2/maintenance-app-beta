import { Field, FieldProps, FieldSet } from '@dhis2/ui'
import React from 'react'
import css from './HorizontalFieldGroup.module.css'

export type HorizontalRadioGroupProps = FieldProps

/* Note this can be simplified to use FieldGroup once FieldGroup className is fixed in UI */
export const HorizontalFieldGroup = ({
    className,
    children,
    ...fieldProps
}: HorizontalRadioGroupProps) => (
    <FieldSet className={className} dataTest={FieldSet.defaultProps?.dataTest}>
        <Field {...fieldProps} className={css.horizontalField}>
            {children}
        </Field>
    </FieldSet>
)
