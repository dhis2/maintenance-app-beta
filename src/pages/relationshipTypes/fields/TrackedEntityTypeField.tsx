import i18n from '@dhis2/d2-i18n'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useField, useFormState, useForm } from 'react-final-form'
import { useHref } from 'react-router'
import { StandardFormField, EditableFieldWrapper } from '../../../components'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'
import { useRefreshModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect/useRefreshSingleSelect'
import { DisplayableModel } from '../../../types/models'
import { ConstraintValue, RelationshipSideFieldsProps } from './types'

export const TrackedEntityTypeField = ({
    prefix,
}: RelationshipSideFieldsProps) => {
    const trackedEntityTypeName = `${prefix}Constraint.trackedEntityType`
    const formValues = useFormState({ subscription: { values: true } }).values
    const constraint = formValues[`${prefix}Constraint`]?.relationshipEntity as
        | ConstraintValue
        | undefined

    const { input: trackedEntityTypeInput } = useField(trackedEntityTypeName)
    const form = useForm()
    const newTrackedEntityTypeLink = useHref('/trackedEntityTypes/new')
    const refresh = useRefreshModelSingleSelect({
        resource: 'trackedEntityTypes',
    })

    const visible = constraint === 'TRACKED_ENTITY_INSTANCE'

    const trackedEntityTypeQuery = useMemo(() => {
        if (!visible) {
            return null
        }
        return {
            resource: 'trackedEntityTypes',
            params: {
                fields: [
                    'id',
                    'displayName',
                    'name',
                    'trackedEntityTypeAttributes[trackedEntityAttribute[id,displayName]]',
                ],
                order: 'displayName:iasc',
                paging: false,
            },
        }
    }, [visible])

    useEffect(() => {
        if (!visible && trackedEntityTypeInput.value) {
            trackedEntityTypeInput.onChange(undefined)
        }
    }, [visible, trackedEntityTypeInput])

    const clearDependentFields = useCallback(() => {
        form.batch(() => {
            form.change(`${prefix}Constraint.program`, undefined)
            form.change(`${prefix}Constraint.trackedEntityAttributes`, [])
        })
    }, [form, prefix])

    if (!visible || !trackedEntityTypeQuery) {
        return null
    }

    return (
        <StandardFormField>
            <EditableFieldWrapper
                onRefresh={() => refresh()}
                onAddNew={() => window.open(newTrackedEntityTypeLink, '_blank')}
            >
                <ModelSingleSelectFormField<DisplayableModel>
                    name={trackedEntityTypeName}
                    label={i18n.t('Tracked entity type')}
                    query={trackedEntityTypeQuery}
                    required={constraint === 'TRACKED_ENTITY_INSTANCE'}
                    inputWidth="330px"
                    onChange={clearDependentFields}
                />
            </EditableFieldWrapper>
        </StandardFormField>
    )
}
