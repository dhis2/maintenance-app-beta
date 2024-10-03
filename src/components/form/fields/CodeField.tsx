import i18n from '@dhis2/d2-i18n'
import { InputFieldFF, Validator } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    composeAsyncValidators,
    required,
    SchemaFieldPropertyType,
    SchemaSection,
    useIsFieldValueUnique,
    useSchema,
} from '../../../lib'
import { useCheckMaxLengthFromPropriety } from '../../../lib/models/useCheckMaxLengthFromSchema'
function useValidator({
    schemaSection,
    propriety,
}: {
    schemaSection: SchemaSection
    propriety: string
}) {
    const schema = useSchema(schemaSection.name)
    const proprietyDetails = schema.properties[propriety]

    const validators = useMemo(() => [] as Validator[], [])
    const params = useParams()
    const modelId = params.id as string
    const checkMaxLength = useCheckMaxLengthFromPropriety(proprietyDetails)
    const checkIsValueTaken = useIsFieldValueUnique({
        model: schemaSection.namePlural,
        field: propriety,
        id: modelId,
    }) as Validator
    if (proprietyDetails.propertyType === SchemaFieldPropertyType.REFERENCE) {
        validators.push(checkMaxLength)
    }
    if (proprietyDetails.unique) {
        validators.push(checkIsValueTaken)
    }
    if (proprietyDetails.required) {
        validators.push(required)
    }

    return useMemo(
        () => composeAsyncValidators<string>(validators),
        [validators]
    )
}

export function CodeField({ schemaSection }: { schemaSection: SchemaSection }) {
    const validator = useValidator({ schemaSection, propriety: 'code' })

    return (
        <FieldRFF
            component={InputFieldFF}
            dataTest="formfields-code"
            inputWidth="150px"
            name="code"
            label={i18n.t('Code')}
            validateFields={[]}
            validate={(code?: string) => validator(code)}
        />
    )
}
