import i18n from '@dhis2/d2-i18n'
import React, { useEffect } from 'react'
import { useFormState, useForm } from 'react-final-form'
import { StandardFormSubsectionTitle } from '../../../components'
import { PaddedContainer } from '../../../components/metadataFormControls/ExpressionBuilder/PaddedContainer'
import {
    ConstraintField,
    TrackedEntityTypeField,
    ProgramField,
    ProgramStageField,
    TrackedEntityAttributesField,
    DataElementsField,
    ConstraintValue,
    RelationshipSideFieldsProps,
} from '../fields'

// Main component for relationship side fields
export const RelationshipSideFields = ({
    prefix,
}: RelationshipSideFieldsProps) => {
    const formValues = useFormState({ subscription: { values: true } }).values
    const constraint = formValues[`${prefix}Constraint`]?.relationshipEntity as
        | ConstraintValue
        | undefined

    const form = useForm()

    // Clear all dependent fields when constraint changes
    useEffect(() => {
        if (form) {
            const trackedEntityTypeName = `${prefix}Constraint.trackedEntityType`
            const programName = `${prefix}Constraint.program`
            const programStageName = `${prefix}Constraint.programStage`
            const attributesName = `${prefix}Constraint.trackedEntityAttributes`
            const dataElementsName = `${prefix}Constraint.dataElements`

            const clearField = (fieldName: string) => {
                const value = form.getFieldState(fieldName)?.value
                if (value) {
                    form.change(fieldName, undefined)
                }
            }

            clearField(trackedEntityTypeName)
            clearField(programName)
            clearField(programStageName)

            const attributesValue = form.getFieldState(attributesName)?.value
            if (Array.isArray(attributesValue) && attributesValue.length) {
                form.change(attributesName, [])
            }

            const dataElementsValue =
                form.getFieldState(dataElementsName)?.value
            if (Array.isArray(dataElementsValue) && dataElementsValue.length) {
                form.change(dataElementsName, [])
            }
        }
    }, [constraint, form, prefix])

    return (
        <PaddedContainer>
            <StandardFormSubsectionTitle>
                {i18n.t(
                    `${
                        prefix === 'from'
                            ? 'Initiating side (From)'
                            : 'Receiving side (To)'
                    }`
                )}
            </StandardFormSubsectionTitle>

            <ConstraintField prefix={prefix} />
            <TrackedEntityTypeField prefix={prefix} />
            <ProgramField prefix={prefix} />
            <ProgramStageField prefix={prefix} />
            <TrackedEntityAttributesField prefix={prefix} />
            <DataElementsField prefix={prefix} />
        </PaddedContainer>
    )
}
