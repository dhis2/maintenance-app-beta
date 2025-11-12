import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'

export function MinCharactersToSearchField() {
    return (
        <FieldRFF
            component={InputFieldFF}
            inputWidth="200px"
            name="minCharactersToSearch"
            dataTest="formfields-minCharactersToSearch"
            type="number"
            min="0"
            label={i18n.t('Minimum characters to search')}
            helpText={i18n.t(
                'Set the minimum characters required to start a search.'
            )}
            format={(value: unknown) =>
                value !== undefined && value !== null ? value.toString() : ''
            }
            parse={(value: unknown) =>
                value !== undefined && value !== '' && value !== null
                    ? Number.parseInt(value as string, 10)
                    : 0
            }
        />
    )
}
