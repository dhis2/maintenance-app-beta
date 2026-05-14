import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ModelTransferField } from '../ModelTransfer'

type GroupMembershipFieldProps = {
    /*
        API resource for the group collection (e.g. 'dataElementGroups',
        'categoryOptionGroups', 'indicatorGroups'). Also used as the form field
        name so the value flows through PATCH/POST and the dedicated
        POST/DELETE endpoints handled by useSyncGroupMembership.
    */
    resource: string
}

export function GroupMembershipField({ resource }: GroupMembershipFieldProps) {
    return (
        <ModelTransferField
            dataTest={`formfields-${resource}`}
            name={resource}
            query={{
                resource,
                params: {
                    fields: ['id', 'displayName'],
                },
            }}
            leftHeader={i18n.t('Available groups')}
            rightHeader={i18n.t('Selected groups')}
            filterPlaceholder={i18n.t('Filter available groups')}
            filterPlaceholderPicked={i18n.t('Filter selected groups')}
        />
    )
}
