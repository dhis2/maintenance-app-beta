import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { Field as FieldRFF, useForm, useFormState } from 'react-final-form'
import {
    VALUE_TYPE,
    required,
    useSchemas,
    useOptionSetQuery,
} from '../../../lib'

/**
 * Field rule: Unless valueType or the selected optionSet's valueType is
 *             MULTI_TEXT, filter out the MULTI_TEXT option
 * Field rule: When the selected optionSet's valueType is MULTI_TEXT, disable
 *             valueType field
 * Field rule: When the selected optionSet's valueType is MULTI_TEXT, set
 *             valueTypeField value to optionSet's valueType
 */
const valueTypeHelpText = i18n.t('The type of data that will be recorded.')
const valueTypeDisabledHelpText = i18n.t(
    'Disabled as the value type must match the value type of the selected option set'
)
const valueTypeOptionSetFields = ['id', 'valueType']
export function ValueTypeField() {
    const { change } = useForm()
    const { values } = useFormState({ subscription: { values: true } })
    const disabled = !!values.optionSet.id
    const [lazy] = useState(!values.optionSet.id)
    const { refetch, ...optionSetQuery } = useOptionSetQuery({
        lazy,
        variables: {
            id: values.optionSet.id,
            fields: valueTypeOptionSetFields,
        },
    })

    useEffect(() => {
        if (values.optionSet.id) {
            refetch({ id: values.optionSet.id })
        }
    }, [refetch, values.optionSet.id])

    useEffect(() => {
        if (
            values.optionSet.id &&
            !optionSetQuery.loading &&
            !optionSetQuery.fetching &&
            !optionSetQuery.error &&
            optionSetQuery.data?.optionSets.valueType
        ) {
            change('valueType', optionSetQuery.data?.optionSets.valueType)
        }
    })

    const schemas = useSchemas()
    const { dataElement } = schemas
    const optionSetHasMultiTextValueType =
        values.valueType === 'MULTI_TEXT' ||
        (values.optionSet?.id &&
            optionSetQuery.data?.optionSets.valueType === 'MULTI_TEXT')

    const options = dataElement.properties.valueType.constants
        ?.map((constant) => ({
            value: constant,
            label: VALUE_TYPE[constant as keyof typeof VALUE_TYPE],
        }))
        .filter(({ value }) => {
            return optionSetHasMultiTextValueType || value !== 'MULTI_TEXT'
        })

    const helpText = disabled
        ? `${valueTypeHelpText} ${valueTypeDisabledHelpText}`
        : valueTypeHelpText

    return (
        <FieldRFF
            required
            disabled={disabled}
            component={SingleSelectFieldFF}
            dataTest="formfields-valuetype"
            inputWidth="400px"
            name="valueType"
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Value type'),
            })}
            helpText={helpText}
            options={options || []}
            validateFields={[]}
            validate={required}
        />
    )
}
