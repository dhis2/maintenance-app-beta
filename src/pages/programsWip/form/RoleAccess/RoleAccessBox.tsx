import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { InlineWarning } from '../../../../components'
import type { ParsedAccessPart, SharingSettings } from '../../../../lib'
import { parseAccessString } from '../../../../lib'
import css from './RoleAccessBox.module.css'

const getAccessLabel = (
    access: ParsedAccessPart | undefined,
    type: 'data' | 'metadata'
): string => {
    if (!access?.read) {
        if (type === 'data') {
            return i18n.t('No data access')
        }
        return i18n.t('No metadata access')
    }
    if (access.write) {
        if (type === 'data') {
            return i18n.t('Data read and write')
        }
        return i18n.t('Metadata read and write')
    }
    if (type === 'data') {
        return i18n.t('Data read')
    }
    return i18n.t('Metadata read')
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
                  .map((group) => ({
                      ...group,
                      type: 'group' as const,
                  }))
                  .sort((a, b) =>
                      (a.displayName || a.id).localeCompare(
                          b.displayName || b.id
                      )
                  )
            : []
        const users = sharing.users
            ? Object.values(sharing.users)
                  .map((user) => ({
                      ...user,
                      type: 'user' as const,
                  }))
                  .sort((a, b) =>
                      (a.displayName || a.id).localeCompare(
                          b.displayName || b.id
                      )
                  )
            : []
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
                        <Button small onClick={onApplyToAllStages}>
                            {i18n.t('Apply to all stages')}
                        </Button>
                    )}
                    {type === 'stage' && onApplyProgramAccessRules && (
                        <Button
                            small
                            onClick={onApplyProgramAccessRules}
                            disabled={!isDifferentFromProgram}
                        >
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
                    <div
                        className={`${css.accessData} ${
                            publicAccess?.data?.read ? '' : css.noAccess
                        }`}
                    >
                        {getAccessLabel(publicAccess?.data, 'data')}
                    </div>
                    <div
                        className={`${css.accessMetadata} ${
                            publicAccess?.metadata?.read ? '' : css.noAccess
                        }`}
                    >
                        {type === 'program' &&
                            getAccessLabel(publicAccess?.metadata, 'metadata')}
                    </div>
                </div>

                <div className={css.accessRow}>
                    <div className={css.accessLabel}>{i18n.t('External')}</div>
                    <div
                        className={`${css.accessData} ${
                            sharing?.external ? '' : css.noAccess
                        }`}
                    >
                        {getAccessLabel(
                            sharing?.external
                                ? { read: true, write: true }
                                : undefined,
                            'data'
                        )}
                    </div>
                    <div className={`${css.accessMetadata} ${css.noAccess}`}>
                        {type === 'program' &&
                            getAccessLabel(undefined, 'metadata')}
                    </div>
                </div>

                {sharingEntities.map((entity) => {
                    const parsed = parseAccessString(entity.access)
                    const prefix =
                        entity.type === 'group'
                            ? i18n.t('Group')
                            : i18n.t('User')
                    return (
                        <div key={entity.id} className={css.accessRow}>
                            <div className={css.accessLabel}>
                                {i18n.t('{{prefix}}: {{name}}', {
                                    prefix,
                                    name: entity.displayName,
                                    interpolation: { escapeValue: false },
                                })}
                            </div>
                            <div
                                className={`${css.accessData} ${
                                    parsed?.data?.read ? '' : css.noAccess
                                }`}
                            >
                                {getAccessLabel(parsed?.data, 'data')}
                            </div>
                            <div
                                className={`${css.accessMetadata} ${
                                    parsed?.metadata?.read ? '' : css.noAccess
                                }`}
                            >
                                {type === 'program' &&
                                    getAccessLabel(
                                        parsed?.metadata,
                                        'metadata'
                                    )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
