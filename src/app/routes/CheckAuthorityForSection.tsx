import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { useSchemaSectionHandleOrThrow } from '../../lib'
import {
    Operation,
    useIsOperationAllowed,
} from '../../lib/user/useIsOperationAllowed'

type CheckAuthorityForSectionProps = {
    operation: Operation
}
export const CheckAuthorityForSection = ({
    operation,
}: CheckAuthorityForSectionProps) => {
    const section = useSchemaSectionHandleOrThrow()
    const allowed = useIsOperationAllowed(section, operation)

    if (!allowed) {
        throw new Error(
            i18n.t('You do not have the authority to view this page.')
        )
    }
    return <Outlet />
}
