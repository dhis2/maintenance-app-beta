import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    composeAsyncValidators,
    required,
    useCheckMaxLengthFromSchema,
    useIsFieldValueUnique,
} from '../../../lib'
import type { SchemaName } from '../../../types'
import type { FormValues } from '../form'

function useValidator() {
    const params = useParams()
    const dataElementId = params.id as string
    const checkIsValueTaken = useIsFieldValueUnique({
        model: 'dataElements',
        field: 'name',
        id: dataElementId,
    })

    const checkMaxLength = useCheckMaxLengthFromSchema(
        'dataElement' as SchemaName,
        'formName'
    )

    return useMemo(
        () =>
            composeAsyncValidators<string, FormValues>([
                checkIsValueTaken,
                checkMaxLength,
                required,
            ]),
        [checkIsValueTaken, checkMaxLength]
    )
}

export function ShortNameField() {
    const validator = useValidator()
    const { meta } = useField('shortName', {
        subscription: { validating: true },
    })

    return (
        <FieldRFF<string | undefined>
            loading={meta.validating}
            component={InputFieldFF}
            dataTest="dataelementsformfields-shortname"
            required
            inputWidth="400px"
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Short name'),
            })}
            name="shortName"
            helpText={i18n.t('Often used in reports where space is limited')}
            validate={(name?: string) => validator(name)}
            validateFields={[]}
        />
    )
}
