import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { InlineWarning } from '../../../../components'
import type { ParsedAccessPart, SharingSettings } from '../../../../lib'
import { parseAccessString } from '../../../../lib'
import css from './RoleAccessBox.module.css'

const getAccessLabel = (access: ParsedAccessPart | undefined): string => {
    if (!access?.read) {
        return i18n.t('No access')
    }
    if (access.write) {
        return i18n.t('Read and write')
    }
    return i18n.t('Read only')
}

type RoleAccessBoxProps = {
    title: string
    type: 'program' | 'stage'
    sharing?: SharingSettings
    isDifferentFromProgram?: boolean
    onApplyToAllStages?: () => void
    onApplyProgramAccessRules?: () => void
    onEditAccess: () => void
}

export const RoleAccessBox = ({
    title,
    type,
    sharing,
    isDifferentFromProgram,
    onApplyToAllStages,
    onApplyProgramAccessRules,
    onEditAccess,
}: RoleAccessBoxProps) => {
    const publicAccess = sharing?.public
        ? parseAccessString(sharing.public)
        : undefined

    const sharingEntities = useMemo(() => {
        if (!sharing) {
            return []
        }

        const userGroups = sharing.userGroups
            ? Object.values(sharing.userGroups)
            : []
        const users = sharing.users ? Object.values(sharing.users) : []
        return [...userGroups, ...users]
    }, [sharing])

    return (
        <div className={css.container}>
            <div className={css.header}>
                <div className={css.titleContainer}>
                    <h3 className={css.title}>{title}</h3>
                    {isDifferentFromProgram && (
                        <InlineWarning
                            message={i18n.t('Differs from program access')}
                        />
                    )}
                </div>
                <div className={css.buttonGroup}>
                    {type === 'program' && onApplyToAllStages && (
                        <Button small secondary onClick={onApplyToAllStages}>
                            {i18n.t('Apply to all stages')}
                        </Button>
                    )}
                    {type === 'stage' && onApplyProgramAccessRules && (
                        <Button small onClick={onApplyProgramAccessRules}>
                            {i18n.t('Revert to program access')}
                        </Button>
                    )}
                    <Button small onClick={onEditAccess}>
                        {type === 'stage'
                            ? i18n.t('Edit data access')
                            : i18n.t('Edit access')}
                    </Button>
                </div>
            </div>

            <div className={css.accessTable}>
                <div className={css.accessRow}>
                    <div className={css.accessLabel}>
                        {i18n.t('Public (All users)')}
                    </div>
                    <div className={css.accessData}>
                        {getAccessLabel(publicAccess?.data)}
                    </div>
                    <div className={css.accessMetadata}>
                        {type === 'program' &&
                            getAccessLabel(publicAccess?.metadata)}
                    </div>
                </div>

                <div className={css.accessRow}>
                    <div className={css.accessLabel}>{i18n.t('External')}</div>
                    <div className={css.accessData}>
                        {sharing?.external
                            ? i18n.t('Read and write')
                            : i18n.t('No access')}
                    </div>
                    <div className={css.accessMetadata}>
                        {type === 'program' && i18n.t('No access')}
                    </div>
                </div>

                {sharingEntities.map((entity) => {
                    const parsed = parseAccessString(entity.access)
                    return (
                        <div key={entity.id} className={css.accessRow}>
                            <div className={css.accessLabel}>
                                {entity.displayName || entity.id}
                            </div>
                            <div className={css.accessData}>
                                {getAccessLabel(parsed?.data)}
                            </div>
                            <div className={css.accessMetadata}>
                                {type === 'program' &&
                                    getAccessLabel(parsed?.metadata)}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
