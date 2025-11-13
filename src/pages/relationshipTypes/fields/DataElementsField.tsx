import i18n from '@dhis2/d2-i18n'
import React, { useEffect, useMemo } from 'react'
import { useFormState, useForm } from 'react-final-form'
import { StandardFormField, ModelTransferField } from '../../../components'
import { ConstraintValue, RelationshipSideFieldsProps } from './types'

export const DataElementsField = ({ prefix }: RelationshipSideFieldsProps) => {
    const dataElementsName = `${prefix}Constraint.dataElements`
    const formValues = useFormState({ subscription: { values: true } }).values
    const constraint = formValues[`${prefix}Constraint`]?.relationshipEntity as
        | ConstraintValue
        | undefined
    const program = formValues[`${prefix}Constraint`]?.program
    const programStage = formValues[`${prefix}Constraint`]?.programStage

    const visible =
        constraint === 'PROGRAM_STAGE_INSTANCE' &&
        !!program?.id &&
        !!programStage?.id

    const query = useMemo(() => {
        if (!visible || !programStage?.id) {
            return {
                resource: 'dataElements',
                params: {
                    filter: [],
                    fields: ['id', 'displayName'],
                    order: 'displayName:iasc',
                },
            }
        }

        return {
            resource: 'dataElements',
            params: {
                filter: [
                    `programStageDataElements.programStage.id:eq:${programStage.id}`,
                ],
                fields: ['id', 'displayName'],
                order: 'displayName:iasc',
            },
        }
    }, [visible, programStage?.id])

    const form = useForm()

    useEffect(() => {
        if (!visible && form) {
            const dataElementsValue =
                form.getFieldState(dataElementsName)?.value
            if (dataElementsValue !== undefined && dataElementsValue !== null) {
                form.change(dataElementsName, [])
            }
        }
    }, [visible, dataElementsName, form])

    if (!visible) {
        return null
    }

    return (
        <StandardFormField>
            <div style={{ marginBottom: '8px' }}>
                {i18n.t(
                    'Choose which data elements are shown when viewing the relationship'
                )}
            </div>
            <ModelTransferField
                name={dataElementsName}
                query={query}
                leftHeader={i18n.t('Available data elements')}
                rightHeader={i18n.t('Selected data elements')}
                filterPlaceholder={i18n.t('Search available data elements')}
                filterPlaceholderPicked={i18n.t(
                    'Search selected data elements'
                )}
                enableOrderChange
                optionsWidth="45%"
                selectedWidth="45%"
            />
        </StandardFormField>
    )
}
