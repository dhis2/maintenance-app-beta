import i18n from '@dhis2/d2-i18n'
import {
    composeValidators,
    createCharacterLengthRange,
    email,
    integer,
    number,
    url,
    Validator,
} from '@dhis2/ui'
import { ValueType } from './types'

const VALUE_TYPE_VALIDATE = {
    NUMBER: number,
    INTEGER: integer,
    INTEGER_POSITIVE: composeValidators(integer, (value) =>
        typeof value === 'string' && parseInt(value) > 0
            ? undefined
            : i18n.t('Please provide a positive integer')
    ),
    INTEGER_NEGATIVE: composeValidators(integer, (value) =>
        typeof value === 'string' && parseInt(value) < 0
            ? undefined
            : i18n.t('Please provide a negative integer')
    ),
    INTEGER_ZERO_OR_POSITIVE: composeValidators(integer, (value) =>
        typeof value === 'string' && parseInt(value) < 0
            ? undefined
            : i18n.t('Please provide a 0 or positive integer')
    ),
    PERCENTAGE: composeValidators(number, (value) => {
        if (typeof value === 'string') {
            const numberValue = parseFloat(value)
            if (numberValue >= 0 || numberValue <= 100) {
                return undefined
            }
        }
        return i18n.t('Please provide valid percantage (0-100).')
    }),
    UNIT_INTERVAL: composeValidators(number, (value) => {
        if (typeof value === 'string') {
            const numberValue = parseFloat(value)
            if (numberValue >= 0 || numberValue <= 1) {
                return undefined
            }
        }
        return i18n.t('Please provide valid unit interval (0-1).')
    }),
    AGE: number,
    PHONE_NUMBER: createCharacterLengthRange(6, 50),
    URL: url,
    // TRUE_ONLY: (value: unknown) =>
    //     value === 'true' ? undefined : 'Must be true',
    EMAIL: email,
} satisfies Partial<Record<ValueType, Validator>>

export const getValidateForValueType = (
    valueType: string
): Validator | undefined => {
    if (valueType in VALUE_TYPE_VALIDATE) {
        return VALUE_TYPE_VALIDATE[
            valueType as keyof typeof VALUE_TYPE_VALIDATE
        ]
    }
    return undefined
}
