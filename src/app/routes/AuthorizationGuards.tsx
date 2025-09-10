import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { useModelSectionHandleOrThrow, useSectionHandle } from '../../lib'
import {
    getMergeAuthority,
    useCanMergeModelInSection,
    useIsSectionAuthorizedPredicate,
    useIsSectionFeatureToggle,
} from '../../lib/sections'

export const SectionAuthorizedGuard = () => {
    const section = useSectionHandle()
    const isSectionAllowed = useIsSectionAuthorizedPredicate()
    const isSectionFeatureToggled = useIsSectionFeatureToggle()

    if (section && !isSectionFeatureToggled(section)) {
        throw new Error(
            i18n.t(
                'This page is not enabled for for the software version you are using'
            )
        )
    }

    if (section && !isSectionAllowed(section)) {
        throw new Error(
            i18n.t('You do not have the authority to view this page.')
        )
    }
    return <Outlet />
}

export const SectionCanMergeGuard = () => {
    const section = useModelSectionHandleOrThrow()
    const canMerge = useCanMergeModelInSection(section)
    if (!canMerge) {
        const mergeAuth = getMergeAuthority(section)
        throw new Error(
            i18n.t(
                'You are missing the required authority ({{authority}}) to view this page.',
                { authority: mergeAuth }
            )
        )
    }
    return <Outlet />
}
