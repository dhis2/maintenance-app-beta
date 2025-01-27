import i18n from '@dhis2/d2-i18n'
import React from 'react'
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

    return (
        <ModelSingleSelectField
            name="workflow"
            label={i18n.t('Approval workflow')}
            query={APPROVAL_WORKFLOWS_QUERY}
        />
    )
}
