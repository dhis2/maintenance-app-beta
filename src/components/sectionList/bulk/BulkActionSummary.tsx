import i18n from '@dhis2/d2-i18n'
import { Button, Divider, IconAdd16, IconCross16 } from '@dhis2/ui'
import React from 'react'
import { PublicAccessPart, parsePublicAccessString } from '../../../lib'
import css from './Bulk.module.css'
import type { SharingAction } from './BulkSharing'

type ActionSummaryProps = {
    action: SharingAction
    dataShareable: boolean
    onRemove: () => void
}
export const ActionSummary = ({
    action,
    dataShareable,
    onRemove,
}: ActionSummaryProps) => (
    <div>
        <div className={css.actionSummary}>
            <span
                className={css.actionDisplayName}
                title={action.sharingEntity.displayName}
            >
                {action.sharingEntity.displayName}
            </span>
            <ActionAccessSummary
                action={action}
                dataShareable={dataShareable}
            />
            <Button small className={css.actionCancelButton} onClick={onRemove}>
                {i18n.t('Cancel')}
            </Button>
        </div>
        <Divider />
    </div>
)

type ActionAccessSummaryProps = {
    action: SharingAction
    dataShareable: boolean
}
const ActionAccessSummary = ({
    action,
    dataShareable,
}: ActionAccessSummaryProps) => {
    const parsed = parsePublicAccessString(action.access)

    if (parsed === null) {
        return null
    }

    return (
        <span className={css.accessSummary}>
            <MetadataAccess access={parsed.metadata} />
            {dataShareable && <DataAccess access={parsed.data} />}
        </span>
    )
}

const MetadataAccess = ({ access }: { access: PublicAccessPart }) => {
    const noAccess = access.read === false

    if (noAccess) {
        return <NoAccess label={i18n.t('Metadata access')} />
    }
    const label = access.write
        ? i18n.t('Metadata view and edit')
        : i18n.t('Metadata view only')

    return <AddAccess label={label} />
}

const DataAccess = ({ access }: { access: PublicAccessPart }) => {
    const noAccess = access.read === false

    if (noAccess) {
        return <NoAccess label={i18n.t('Data access')} />
    }
    const label = access.write
        ? i18n.t('Data view and capture')
        : i18n.t('Data view only')

    return <AddAccess label={label}></AddAccess>
}

const AddAccess = ({ label }: { label: string }) => {
    return (
        <span className={css.actionAccessAdd}>
            <IconAdd16 /> {label}
        </span>
    )
}

const NoAccess = ({ label }: { label: string }) => {
    return (
        <span className={css.actionNoAccess}>
            <IconCross16 /> {label}
        </span>
    )
}
