import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useField } from 'react-final-form'
import { ModelSingleSelectField } from '../../../components/metadataFormControls/ModelSingleSelect'

export type WorkflowTypes = {
    dataApprovalWorkflows: [{ displayName: string; id: string }]
}

export function DataApprovalWorkflowField() {
    const APPROVAL_WORKFLOWS_QUERY = {
        resource: 'dataApprovalWorkflows',
        params: {
            fields: ['displayName', 'id'],
        },
    }

    const { input, meta } = useField('workflow')

    return (
        <ModelSingleSelectField
            input={input}
            meta={meta}
            label={i18n.t('Approval workflow')}
            query={APPROVAL_WORKFLOWS_QUERY}
        />
    )
}
