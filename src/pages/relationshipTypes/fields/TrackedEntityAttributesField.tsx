import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useField, useFormState, useForm } from 'react-final-form'
import { useHref } from 'react-router'
import { StandardFormField } from '../../../components'
import { useRefreshModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect/useRefreshSingleSelect'
import { BaseModelTransfer } from '../../../components/metadataFormControls/ModelTransfer/BaseModelTransfer'
import {
    DefaultTransferLeftFooter,
    TransferHeader,
} from '../../../components/metadataFormControls/ModelTransfer/ModelTransfer'
import { DisplayableModel } from '../../../types/models'
import { ConstraintValue, RelationshipSideFieldsProps } from './types'

export const TrackedEntityAttributesField = ({
    prefix,
}: RelationshipSideFieldsProps) => {
    const attributesName = `${prefix}Constraint.trackedEntityAttributes`
    const formValues = useFormState({ subscription: { values: true } }).values
    const constraint = formValues[`${prefix}Constraint`]?.relationshipEntity as
        | ConstraintValue
        | undefined
    const trackedEntityType =
        formValues[`${prefix}Constraint`]?.trackedEntityType
    const program = formValues[`${prefix}Constraint`]?.program

    const newTrackedEntityAttributeLink = useHref(
        '/trackedEntityAttributes/new'
    )
    const refreshTrackedEntityType = useRefreshModelSingleSelect({
        resource: 'trackedEntityTypes',
    })
    const refreshProgram = useRefreshModelSingleSelect({
        resource: 'programs',
    })

    const form = useForm()
    const hasInitializedRef = useRef(false)

    const visible = useMemo(() => {
        if (!constraint || constraint === 'PROGRAM_STAGE_INSTANCE') {
            return false
        }
        return (
            (constraint === 'TRACKED_ENTITY_INSTANCE' &&
                !!trackedEntityType?.id) ||
            (constraint === 'PROGRAM_INSTANCE' && !!program?.id)
        )
    }, [constraint, trackedEntityType?.id, program?.id])

    const availableAttributes = useMemo<DisplayableModel[]>(() => {
        if (
            constraint === 'TRACKED_ENTITY_INSTANCE' &&
            trackedEntityType?.trackedEntityTypeAttributes
        ) {
            return trackedEntityType.trackedEntityTypeAttributes
                .map(
                    (teta: { trackedEntityAttribute?: DisplayableModel }) =>
                        teta.trackedEntityAttribute
                )
                .filter(
                    (
                        attr: DisplayableModel | undefined
                    ): attr is DisplayableModel => !!attr
                )
        }
        if (
            constraint === 'PROGRAM_INSTANCE' &&
            program?.programTrackedEntityAttributes
        ) {
            return program.programTrackedEntityAttributes
                .map(
                    (ptea: { trackedEntityAttribute?: DisplayableModel }) =>
                        ptea.trackedEntityAttribute
                )
                .filter(
                    (
                        attr: DisplayableModel | undefined
                    ): attr is DisplayableModel => !!attr
                )
        }
        return []
    }, [
        constraint,
        trackedEntityType?.trackedEntityTypeAttributes,
        program?.programTrackedEntityAttributes,
    ])

    const { input: attributesInput, meta } = useField<DisplayableModel[]>(
        attributesName,
        {
            multiple: true,
            validateFields: [],
        }
    )

    // Sync initial values from trackerDataView.attributes when component becomes visible and attributes are available
    useEffect(() => {
        if (!visible || availableAttributes.length === 0) {
            hasInitializedRef.current = false
            return
        }

        // Only initialize once per visibility cycle
        if (hasInitializedRef.current) {
            return
        }

        const constraintData = formValues[`${prefix}Constraint`] as
            | { trackerDataView?: { attributes?: string[] } }
            | undefined
        const attributeIdsFromApi =
            constraintData?.trackerDataView?.attributes || []

        // Only update if we have IDs from API
        if (attributeIdsFromApi.length > 0) {
            const attributesFromApi = availableAttributes.filter((attr) =>
                attributeIdsFromApi.includes(attr.id)
            )
            if (attributesFromApi.length > 0) {
                attributesInput.onChange(attributesFromApi)
                hasInitializedRef.current = true
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, availableAttributes.length])

    useEffect(() => {
        if (
            !visible &&
            Array.isArray(attributesInput.value) &&
            attributesInput.value.length > 0
        ) {
            attributesInput.onChange([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, attributesInput.value])

    const handleChange = useCallback(
        ({ selected }: { selected: DisplayableModel[] }) => {
            // Extract IDs from selected attributes (like maintenance-app does)
            const attributeIds = selected.map((attr) => attr?.id || attr)

            // Update trackerDataView.attributes directly with array of IDs
            // This matches how maintenance-app does it (line 313-322 in relationshipType.js)
            const constraintPath = `${prefix}Constraint`
            const currentConstraint = (formValues[constraintPath] || {}) as {
                trackerDataView?: {
                    attributes?: string[]
                    dataElements?: string[]
                }
                [key: string]: unknown
            }
            const currentTrackerDataView =
                currentConstraint.trackerDataView || {}

            // Update the constraint's trackerDataView.attributes
            form.change(constraintPath, {
                ...currentConstraint,
                trackerDataView: {
                    ...currentTrackerDataView,
                    attributes: attributeIds,
                },
            })

            // Also update the local field for UI display
            attributesInput.onChange(selected)
            attributesInput.onBlur()
        },
        [attributesInput, prefix, formValues, form]
    )

    if (!visible) {
        return null
    }

    return (
        <StandardFormField>
            <Field
                error={meta.invalid}
                validationText={(meta.touched && meta.error?.toString()) || ''}
                name={attributesName}
                label={i18n.t('Tracked entity attributes')}
            >
                <BaseModelTransfer<DisplayableModel>
                    available={availableAttributes}
                    selected={attributesInput.value || []}
                    onChange={handleChange}
                    leftHeader={
                        <TransferHeader>
                            {i18n.t('Available tracked entity attributes')}
                        </TransferHeader>
                    }
                    rightHeader={
                        <TransferHeader>
                            {i18n.t('Selected tracked entity attributes')}
                        </TransferHeader>
                    }
                    leftFooter={
                        <DefaultTransferLeftFooter
                            onRefreshClick={() => {
                                if (
                                    constraint === 'TRACKED_ENTITY_INSTANCE' &&
                                    trackedEntityType?.id
                                ) {
                                    refreshTrackedEntityType()
                                } else if (
                                    constraint === 'PROGRAM_INSTANCE' &&
                                    program?.id
                                ) {
                                    refreshProgram()
                                }
                            }}
                            newLink={newTrackedEntityAttributeLink}
                        />
                    }
                    filterPlaceholder={i18n.t('Search available attributes')}
                    filterPlaceholderPicked={i18n.t(
                        'Search selected attributes'
                    )}
                    filterable
                    filterablePicked
                    enableOrderChange
                    optionsWidth="45%"
                    selectedWidth="45%"
                />
            </Field>
        </StandardFormField>
    )
}
