import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useField, useFormState } from 'react-final-form'
import { ModelSingleSelectField } from '../../../components/metadataFormControls/ModelSingleSelect'

export type WorkflowTypes = {
    dataApprovalWorkflows: [{ displayName: string; id: string }]
}

export function DataApprovalWorkflowField() {
    const { values } = useFormState({ subscription: { values: true } })
    const selectedCategoryCombo = values.categoryCombo?.id
    const APPROVAL_WORKFLOWS_QUERY = {
        resource: 'dataApprovalWorkflows',
        params: {
            fields: ['displayName', 'id'],
            filters: [
                `categoryCombo.id:eq:${selectedCategoryCombo}`,
                'categoryCombo.id:null',
            ],
            rootJunction: 'OR',
        },
    }

    const { input, meta } = useField('workflow')

    return (
        <ModelSingleSelectField
            clearable
            input={input}
            meta={meta}
            label={i18n.t('Approval workflow')}
            query={APPROVAL_WORKFLOWS_QUERY}
        />
    )
}
