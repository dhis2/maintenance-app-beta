import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import {
    StandardFormField,
    ButtonGroup,
    ButtonOption,
} from '../../../components'
import { required } from '../../../lib'
import { ConstraintValue, RelationshipSideFieldsProps } from './types'

const CONSTRAINT_OPTIONS: ButtonOption[] = [
    {
        value: 'PROGRAM_STAGE_INSTANCE',
        label: i18n.t('Event'),
    },
    {
        value: 'PROGRAM_INSTANCE',
        label: i18n.t('Enrollment'),
    },
    {
        value: 'TRACKED_ENTITY_INSTANCE',
        label: i18n.t('Tracked entity'),
    },
]

export const ConstraintField = ({ prefix }: RelationshipSideFieldsProps) => {
    const name = `${prefix}Constraint.relationshipEntity`
    const { input, meta } = useField<ConstraintValue | undefined>(name, {
        validate: required,
    })

    return (
        <StandardFormField>
            <Field
                error={meta.touched && meta.invalid}
                validationText={(meta.touched && meta.error?.toString()) || ''}
            >
                <ButtonGroup
                    options={CONSTRAINT_OPTIONS}
                    selected={input.value}
                    onChange={(value) => {
                        input.onChange(value)
                        input.onBlur()
                    }}
                    dataTest={`${prefix}-constraint-selector`}
                />
            </Field>
        </StandardFormField>
    )
}
