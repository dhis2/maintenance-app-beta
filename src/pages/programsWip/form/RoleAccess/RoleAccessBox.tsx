import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import {
    InlineWarning,
    StandardFormSubsectionTitle,
} from '../../../../components'
import type { ParsedAccessPart, SharingSettings } from '../../../../lib'
import { parseAccessString } from '../../../../lib'
import css from './RoleAccessBox.module.css'

const getDataAccessLabel = (access: ParsedAccessPart | null): string => {
    if (access?.write) {
        return i18n.t('Data read and write')
    }
    if (access?.read) {
        return i18n.t('Data read')
    }
    return i18n.t('No data access')
}

const getMetadataAccessLabel = (access: ParsedAccessPart | null): string => {
    if (access?.write) {
        return i18n.t('Metadata read and write')
    }
    if (access?.read) {
        return i18n.t('Metadata read')
    }
    return i18n.t('No metadata access')
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
    const publicAccessParsed = sharing?.public
        ? parseAccessString(sharing.public)
        : null
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
                <div className={css.titleContainer}>
                    <StandardFormSubsectionTitle>
                        {title}
                    </StandardFormSubsectionTitle>
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
                            {i18n.t('Apply program access rules')}
                        </Button>
                    )}
                    <Button small onClick={onEditAccess}>
                        {i18n.t('Edit access')}
                    </Button>
                </div>
            </div>

            <div className={css.accessTable}>
                <div className={css.accessHeaderRow}>
                    <div className={css.accessLabel}></div>
                    <div className={css.accessHeader}>
                        {i18n.t('Data access')}
                    </div>
                    <div className={css.accessHeader}>
                        {i18n.t('Metadata access')}
                    </div>
                </div>
                <div className={css.accessRow}>
                    <div className={css.accessLabel}>
                        {i18n.t('Public (All users)')}
                    </div>
                    <div
                        className={
                            publicAccessParsed?.data.read
                                ? css.accessData
                                : `${css.accessData} ${css.noAccess}`
                        }
                    >
                        {getDataAccessLabel(publicAccessParsed?.data || null)}
                    </div>
                    <div
                        className={
                            publicAccessParsed?.metadata.read
                                ? css.accessMetadata
                                : `${css.accessMetadata} ${css.noAccess}`
                        }
                    >
                        {getMetadataAccessLabel(
                            publicAccessParsed?.metadata || null
                        )}
                    </div>
                </div>

                <div className={css.accessRow}>
                    <div className={css.accessLabel}>{i18n.t('External')}</div>
                    <div
                        className={
                            isExternal
                                ? css.accessData
                                : `${css.accessData} ${css.noAccess}`
                        }
                    >
                        {isExternal
                            ? i18n.t('Has access')
                            : i18n.t('No access')}
                    </div>
                    <div className={`${css.accessMetadata} ${css.noAccess}`}>
                        {i18n.t('No access')}
                    </div>
                </div>

                {allUserGroupsAndUsers.map((entity) => {
                    const parsed = entity.access
                        ? parseAccessString(entity.access)
                        : null
                    return (
                        <div key={entity.id} className={css.accessRow}>
                            <div className={css.accessLabel}>
                                {entity.displayName || entity.id}
                            </div>
                            <div
                                className={
                                    parsed?.data.read
                                        ? css.accessData
                                        : `${css.accessData} ${css.noAccess}`
                                }
                            >
                                {getDataAccessLabel(parsed?.data || null)}
                            </div>
                            <div
                                className={
                                    parsed?.metadata.read
                                        ? css.accessMetadata
                                        : `${css.accessMetadata} ${css.noAccess}`
                                }
                            >
                                {getMetadataAccessLabel(
                                    parsed?.metadata || null
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
