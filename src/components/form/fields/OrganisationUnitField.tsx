import i18n from '@dhis2/d2-i18n'
import {
    Field,
    OrganisationUnitTree,
    OrganisationUnitTreeProps,
} from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { useCurrentUserRootOrgUnits } from '../../../lib/user/currentUserStore'

type OrganisationUnitFieldProps = {
    name?: string
}

type OrganisationUnitFormValue = {
    id: string
    path: string
}

export const OrganisationUnitField = ({ name }: OrganisationUnitFieldProps) => {
    const { input, meta } = useField<
        OrganisationUnitFormValue[],
        HTMLElement,
        string[]
    >(name ?? 'organisationUnits', {
        format: (orgUnits) => orgUnits?.map((ou) => ou.path),
        parse: (orgUnitPaths) => {
            return orgUnitPaths?.map((ouPath) => ({
                id: ouPath.split('/').slice(-1)[0],
                path: ouPath,
            }))
        },
    })

    const roots = useCurrentUserRootOrgUnits()

    const rootIds = roots.map((ou) => ou.id)

    const handleChange: OrganisationUnitTreeProps['onChange'] = ({
        selected,
    }) => {
        input.onChange(selected)
        input.onBlur()
    }
    return (
        <Field
            label={i18n.t('Select organisation units')}
            error={meta.touched && meta.error}
            validationText={meta.touched && meta.error}
        >
            <OrganisationUnitTree
                roots={rootIds}
                onChange={handleChange}
                selected={input.value || []}
                initiallyExpanded={rootIds}
            />
        </Field>
    )
}
