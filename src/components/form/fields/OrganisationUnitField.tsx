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
    displayName: string
}

export const OrganisationUnitField = ({ name }: OrganisationUnitFieldProps) => {
    const { input, meta } = useField<
        OrganisationUnitFormValue[],
        HTMLElement,
        OrganisationUnitFormValue[]
    >(name ?? 'organisationUnits')

    const roots = useCurrentUserRootOrgUnits()

    const rootIds = roots.map((ou) => ou.id)

    const handleChange: OrganisationUnitTreeProps['onChange'] = ({
        selected,
        displayName,
        id,
        path,
    }) => {
        const prevSelected = new Map(input.value.map((ou) => [ou.path, ou]))
        const newSelected = selected.map((selectedPath) => {
            const prev = prevSelected.get(selectedPath)
            return prev ?? { id, path, displayName }
        })

        input.onChange(newSelected)
        input.onBlur()
    }

    const selectedPaths = input.value?.map((ou) => ou.path) ?? []

    return (
        <Field
            label={i18n.t('Select organisation units')}
            error={meta.touched && meta.error}
            validationText={meta.touched && meta.error}
        >
            <OrganisationUnitTree
                roots={rootIds}
                onChange={handleChange}
                selected={selectedPaths}
                initiallyExpanded={rootIds}
            />
        </Field>
    )
}
