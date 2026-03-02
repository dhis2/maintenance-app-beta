import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import {
    getConstantTranslation,
    useSchema,
    useSchemaSectionHandleOrThrow,
} from '../../../../../lib'
import { validationStrategyOptions } from '../../constants'

export function ValidationStrategyField() {
    const schemaSection = useSchemaSectionHandleOrThrow()
    const schema = useSchema(schemaSection.name)
    const { input, meta } = useField('validationStrategy')

    const schemaOptions =
        schema.properties?.validationStrategy?.constants?.map(
            (constant: string) => ({
                value: constant,
                label: getConstantTranslation(constant),
            })
        ) || []

    const options =
        schemaOptions.length > 0 ? schemaOptions : validationStrategyOptions

    return (
        <SingleSelectFieldFF
            name="validationStrategy"
            label={i18n.t('Validation strategy')}
            inputWidth="400px"
            options={options}
            input={input}
            meta={meta}
            dataTest="formfields-validationStrategy"
        />
    )
}
