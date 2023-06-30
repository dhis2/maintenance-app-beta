import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { useSectionHandle } from '../../lib'
import { useIsSectionAuthorizedPredicate } from '../../lib/sections'

export const CheckAuthorityForSection = () => {
    const section = useSectionHandle()
    const isSectionAllowed = useIsSectionAuthorizedPredicate()

    if (section && !isSectionAllowed(section)) {
        throw new Error(
            i18n.t('You do not have the authority to view this page.')
        )
    }
    return <Outlet />
}
