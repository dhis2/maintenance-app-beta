import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, FieldMetaState } from 'react-final-form'

export function HideDueDateField() {
    return (
        <FieldRFF<boolean>
            name="hideDueDate"
            type="checkbox"
            format={(value: boolean | undefined) => !value}
            parse={(value: boolean | undefined) => !value}
            render={({ input, meta, ...rest }) => (
                <CheckboxFieldFF
                    {...rest}
                    input={{
                        ...input,
                        value: input.value ? 'true' : 'false',
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                            input.onChange(e.target.checked)
                        },
                    }}
                    meta={meta as unknown as FieldMetaState<string | undefined>}
                    label={i18n.t('Show scheduled date')}
                    dataTest="formfields-hideDueDate"
                />
            )}
        />
    )
}
