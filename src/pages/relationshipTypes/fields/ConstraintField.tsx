import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React, { useCallback, useEffect, useRef } from 'react'
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
    const constraintFieldName = `${prefix}Constraint.relationshipEntity`

    const { input, meta } = useField<ConstraintValue | undefined>(
        constraintFieldName,
        { validate: required }
    )
    const form = useForm()
    const previousConstraintRef = useRef<ConstraintValue | undefined>(undefined)

    const clearDependentFields = useCallback(() => {
        const trackerDataViewPath = `${prefix}Constraint.trackerDataView`
        const trackedEntityTypePath = `${prefix}Constraint.trackedEntityType`
        const programPath = `${prefix}Constraint.program`
        const programStagePath = `${prefix}Constraint.programStage`

        form.batch(() => {
            form.change(trackedEntityTypePath, undefined)
            form.change(programPath, undefined)
            form.change(programStagePath, undefined)
            form.change(trackerDataViewPath, {
                attributes: [],
                dataElements: [],
            })
        })
    }, [form, prefix])

    useEffect(() => {
        const previousConstraint = previousConstraintRef.current
        if (
            previousConstraint !== undefined &&
            previousConstraint !== input.value
        ) {
            clearDependentFields()
        }
        previousConstraintRef.current = input.value
    }, [input.value, clearDependentFields])

    return (
        <StandardFormField>
            <Field
                error={meta.touched && meta.invalid}
                validationText={(meta.touched && meta.error?.toString()) || ''}
                dataTest={`${prefix}-constraint-field`}
            >
                <ButtonGroup
                    options={CONSTRAINT_OPTIONS}
                    selected={input.value}
                    onChange={(value: string) => {
                        const constraintValue = value as ConstraintValue
                        input.onChange(constraintValue)
                        input.onBlur()
                    }}
                    prefix={prefix}
                    ariaLabel={i18n.t('Relationship entity constraint')}
                />
            </Field>
        </StandardFormField>
    )
}
