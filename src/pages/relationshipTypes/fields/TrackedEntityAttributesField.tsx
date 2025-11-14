import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React, { useEffect, useMemo } from 'react'
import { useField, useFormState } from 'react-final-form'
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

    const { input: attributesInput, meta } = useField<DisplayableModel[]>(
        attributesName,
        {
            multiple: true,
            validateFields: [],
        }
    )

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

    useEffect(() => {
        if (
            !visible &&
            Array.isArray(attributesInput.value) &&
            attributesInput.value.length > 0
        ) {
            attributesInput.onChange([])
        }
    }, [visible, attributesInput])

    if (!visible || availableAttributes.length === 0) {
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
                    onChange={({ selected }) => {
                        attributesInput.onChange(selected)
                        attributesInput.onBlur()
                    }}
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
