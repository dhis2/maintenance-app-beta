import { composeValidators, hasValue, Validator } from '@dhis2/ui'
import React, { useMemo } from 'react'
import {
    FieldProps,
    FieldRenderProps,
    Field as FieldRFF,
} from 'react-final-form'
import { ValueType } from './types'
import { getValidateForValueType } from './validateByValueType'
import { ValueTypeRenderer } from './ValueTypeRenderer'

type CommonFieldProps = {
    label?: string
    required?: boolean
}

export type FormFieldByValueTypeProps = FieldProps<
    string,
    FieldRenderProps<string>
> &
    CommonFieldProps & {
        valueType: ValueType
        validate?: Validator
    }

export const FormFieldByValueType = (props: FormFieldByValueTypeProps) => {
    const validate = useMemo(() => {
        const validateForValueType = getValidateForValueType(props.valueType)
        const validators = [
            props.required ? hasValue : undefined,
            props.validate,
            validateForValueType,
        ].filter((v) => !!v)

        return composeValidators(...validators)
    }, [props.valueType, props.required, props.validate])

    const commonProps = {
        // if for some reason the valueType is changed during render (it shouldnt)
        // we reset the component (by using the key) to get updated validators etc
        ...props,
        validate,
    }
    return (
        <div style={{ width: '440px' }}>
            {/* if for some reason the valueType is changed during render (it shouldnt)
                 we reset the component (by using the key) to get updated validators etc */}
            <FieldRFF
                key={props.valueType}
                {...commonProps}
                component={ValueTypeRenderer}
            />
        </div>
    )
}
