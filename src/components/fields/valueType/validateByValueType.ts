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
    // backend has a more thorough check, but it also specifies length between 6 and 50
    // ref: https://github.com/dhis2/dhis2-core/blob/master/dhis-2/dhis-services/dhis-service-dxf2/src/main/java/org/hisp/dhis/dxf2/metadata/objectbundle/validation/attribute/DefaultAttributeValidator.java#L86
    PHONE_NUMBER: createCharacterLengthRange(6, 50),
    URL: url,
    //true_only doesnt make much sense imo, but this is what the backend is doing...
    TRUE_ONLY: (value: unknown) =>
        value === 'true' ? undefined : i18n.t('Must be checked'),
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
