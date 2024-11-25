import i18n from '@dhis2/d2-i18n'
import { TextAreaFieldFF } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    composeAsyncValidators,
    required,
    useCheckMaxLengthFromSchema,
    useIsFieldValueUnique,
    SchemaSection,
} from '../../../lib'

function useValidator({
    schemaSection,
    fieldName,
}: {
    schemaSection: SchemaSection
    fieldName: string
}) {
    const params = useParams()
    const modelId = params.id as string
    const checkIsValueTaken = useIsFieldValueUnique({
        model: schemaSection.namePlural,
        field: fieldName,
        id: modelId,
    })

    const checkMaxLength = useCheckMaxLengthFromSchema(
        schemaSection.name,
        fieldName
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

export function DescriptionField({
    helpText,
    schemaSection,
}: {
    helpText?: string
    schemaSection: SchemaSection
}) {
    const validator = useValidator({ schemaSection, fieldName: 'description' })
    const { meta } = useField('description', {
        subscription: { validating: true },
    })

    const helpString =
        helpText ||
        i18n.t('A description should be clear and provide necessary details.')

    return (
        <FieldRFF<string | undefined>
            loading={meta.validating}
            component={TextAreaFieldFF}
            dataTest="formfields-description"
            inputWidth="400px"
            name="description"
            label={i18n.t('Description (required)', {
                fieldLabel: i18n.t('Description'),
            })}
            helpText={helpString}
            validate={(description?: string) => validator(description)}
            validateFields={[]}
        />
    )
}
