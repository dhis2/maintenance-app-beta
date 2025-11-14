import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React, { useCallback } from 'react'
import { useField, useForm } from 'react-final-form'
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
    const form = useForm()

    const clearDependentFields = useCallback(() => {
        form.batch(() => {
            form.change(`${prefix}Constraint.trackedEntityType`, undefined)
            form.change(`${prefix}Constraint.program`, undefined)
            form.change(`${prefix}Constraint.programStage`, undefined)
            form.change(`${prefix}Constraint.trackedEntityAttributes`, [])
            form.change(`${prefix}Constraint.dataElements`, [])
        })
    }, [form, prefix])

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
                        const previousValue = input.value
                        input.onChange(value)
                        input.onBlur()

                        if (previousValue !== value) {
                            clearDependentFields()
                        }
                    }}
                    dataTest={`${prefix}-constraint-selector`}
                />
            </Field>
        </StandardFormField>
    )
}
