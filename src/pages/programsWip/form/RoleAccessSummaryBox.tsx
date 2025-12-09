import i18n from '@dhis2/d2-i18n'
import { Button, NoticeBox } from '@dhis2/ui'
import React from 'react'
import { parseAccessString } from '../../../lib'
import css from './RoleAccessSummaryBox.module.css'

type SharingSettings = {
    owner?: string
    external: boolean
    public?: string
    userGroups: Record<
        string,
        { id: string; access: string; displayName?: string }
    >
    users: Record<string, { id: string; access: string; displayName?: string }>
}

type RoleAccessSummaryBoxProps = {
    title: string
    type: 'program' | 'stage'
    sharing?: SharingSettings
    hasAccessDifference?: boolean
    onApplyToAllStages?: () => void
    onApplyProgramAccessRules?: () => void
    onEditAccess: () => void
}

const getAccessLabel = (accessString: string | undefined) => {
    if (!accessString) {
        return i18n.t('No access')
    }

    const parsed = parseAccessString(accessString)
    if (!parsed) {
        return i18n.t('No access')
    }

    const { metadata, data } = parsed
    const metadataAccess = metadata.write
        ? i18n.t('Edit and view')
        : metadata.read
        ? i18n.t('View only')
        : i18n.t('No access')

    const dataAccess = data.write
        ? i18n.t('Can edit and capture')
        : data.read
        ? i18n.t('View only')
        : i18n.t('No access')

    return { metadata: metadataAccess, data: dataAccess }
}

export const RoleAccessSummaryBox = ({
    title,
    type,
    sharing,
    hasAccessDifference,
    onApplyToAllStages,
    onApplyProgramAccessRules,
    onEditAccess,
}: RoleAccessSummaryBoxProps) => {
    const publicAccess = getAccessLabel(sharing?.public)
    const isExternal = sharing?.external || false

    const allUserGroupsAndUsers = React.useMemo(() => {
        const userGroups = sharing?.userGroups
            ? Object.values(sharing.userGroups)
            : []
        const users = sharing?.users ? Object.values(sharing.users) : []
        return [...userGroups, ...users]
    }, [sharing])

    return (
        <div className={css.container}>
            <div className={css.header}>
                <h3 className={css.title}>{title}</h3>
                <div className={css.buttonGroup}>
                    {type === 'program' && onApplyToAllStages && (
                        <Button small secondary onClick={onApplyToAllStages}>
                            {i18n.t('Apply to all stages')}
                        </Button>
                    )}
                    {type === 'stage' && onApplyProgramAccessRules && (
                        <Button
                            small
                            secondary
                            onClick={onApplyProgramAccessRules}
                        >
                            {i18n.t('Apply program access rules')}
                        </Button>
                    )}
                    <Button small onClick={onEditAccess}>
                        {i18n.t('Edit access')}
                    </Button>
                </div>
            </div>

            {hasAccessDifference && (
                <NoticeBox
                    warning
                    title={i18n.t('Differs from program access')}
                >
                    {i18n.t(
                        'This stage has different access settings than the program.'
                    )}
                </NoticeBox>
            )}

            <div className={css.accessTable}>
                <div className={css.accessRow}>
                    <div className={css.accessLabel}>
                        {i18n.t('Public (All users)')}
                    </div>
                    <div className={css.accessValue}>
                        {typeof publicAccess === 'string'
                            ? publicAccess
                            : `${i18n.t('Metadata')}: ${
                                  publicAccess.metadata
                              }, ${i18n.t('Data')}: ${publicAccess.data}`}
                    </div>
                </div>

                <div className={css.accessRow}>
                    <div className={css.accessLabel}>{i18n.t('External')}</div>
                    <div className={css.accessValue}>
                        {isExternal
                            ? i18n.t('Has access')
                            : i18n.t('No access')}
                    </div>
                </div>

                {allUserGroupsAndUsers.map((entity) => {
                    const access = getAccessLabel(entity.access)
                    return (
                        <div key={entity.id} className={css.accessRow}>
                            <div className={css.accessLabel}>
                                {entity.displayName || entity.id}
                            </div>
                            <div className={css.accessValue}>
                                {typeof access === 'string'
                                    ? access
                                    : `${i18n.t('Metadata')}: ${
                                          access.metadata
                                      }, ${i18n.t('Data')}: ${access.data}`}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
