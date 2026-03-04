import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'

export function MinCharactersToSearchField() {
    return (
        <Field
            component={InputFieldFF}
            inputWidth="200px"
            name="minCharactersToSearch"
            dataTest="formfields-minCharactersToSearch"
            type="number"
            min="0"
            label={i18n.t('Minimum characters required to search')}
            helpText={i18n.t(
                'Users must enter at least this many characters to search. Enter 0 for no minimum.'
            )}
            format={(value: unknown) => value?.toString()}
            parse={(value: unknown) => {
                if (value === undefined || value === '') {
                    return 0
                }
                return Number.parseInt(value as string, 10)
            }}
        />
    )
}
