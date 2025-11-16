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
    const constraintFieldName = `${prefix}Constraint.relationshipEntity`

    const { input, meta } = useField<ConstraintValue | undefined>(
        constraintFieldName,
        { validate: required }
    )
    const form = useForm()

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

    return (
        <StandardFormField>
            <Field
                error={meta.touched && meta.invalid}
                validationText={(meta.touched && meta.error?.toString()) || ''}
            >
                <ButtonGroup
                    options={CONSTRAINT_OPTIONS}
                    selected={input.value}
                    onChange={(value: string) => {
                        const previousValue = input.value
                        const constraintValue = value as ConstraintValue
                        input.onChange(constraintValue)
                        input.onBlur()

                        if (previousValue !== constraintValue) {
                            clearDependentFields()
                        }
                    }}
                    dataTest={`${prefix}-constraint-selector`}
                    ariaLabel={i18n.t('Relationship entity constraint')}
                />
            </Field>
        </StandardFormField>
    )
}
