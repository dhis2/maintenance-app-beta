import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    SchemaSection,
    composeAsyncValidators,
    required,
    useCheckMaxLengthFromSchema,
    useIsFieldValueUnique,
} from '../../../lib'

function useValidator({ schemaSection }: { schemaSection: SchemaSection }) {
    const params = useParams()
    const modelId = params.id as string
    const checkIsValueTaken = useIsFieldValueUnique({
        model: schemaSection.namePlural,
        field: 'name',
        id: modelId,
    })

    const checkMaxLength = useCheckMaxLengthFromSchema(
        schemaSection.name,
        'shortName'
    )

    return useMemo(
        () =>
            composeAsyncValidators<string>([
                checkIsValueTaken,
                checkMaxLength,
                required,
            ]),
        [checkIsValueTaken, checkMaxLength]
    )
}

export function ShortNameField({
    helpText,
    schemaSection,
}: {
    helpText?: string
    schemaSection: SchemaSection
}) {
    const validator = useValidator({ schemaSection })
    const { meta } = useField('shortName', {
        subscription: { validating: true },
    })

    const helpString =
        helpText || i18n.t('Often used in reports where space is limited.')

    return (
        <FieldRFF<string | undefined>
            loading={meta.validating}
            component={InputFieldFF}
            dataTest="formfields-shortname"
            required
            inputWidth="400px"
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Short name'),
            })}
            name="shortName"
            helpText={helpString}
            validate={(name?: string) => validator(name)}
            validateFields={[]}
        />
    )
}
