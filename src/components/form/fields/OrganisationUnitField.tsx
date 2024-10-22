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
    singleSelection?: boolean
    onChange?: (orgUnits: OrganisationUnitFormValue[]) => void
}

export type OrganisationUnitFormValue = {
    id: string
    path: string
    displayName: string
}

export const OrganisationUnitField = ({
    name,
    onChange,
    singleSelection = false,
}: OrganisationUnitFieldProps) => {
    const { input, meta } = useField<
        OrganisationUnitFormValue[] | '',
        HTMLElement,
        OrganisationUnitFormValue[]
    >(name ?? 'organisationUnits', {
        format: (value) => (value === '' ? [] : value),
    })

    const roots = useCurrentUserRootOrgUnits()

    const rootIds = roots.map((ou) => ou.id)

    const handleChange: OrganisationUnitTreeProps['onChange'] = ({
        selected,
        displayName,
        id,
        path,
    }) => {
        const prevSelected = input.value
            ? new Map(input.value.map((ou) => [ou.path, ou]))
            : new Map()
        const newSelected = selected.map((selectedPath) => {
            const prev = prevSelected.get(selectedPath)
            return prev ?? { id, path, displayName }
        })

        input.onChange(newSelected)
        input.onBlur()
        if (onChange) {
            onChange(newSelected)
        }
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
                singleSelection={singleSelection}
                onChange={handleChange}
                selected={selectedPaths}
                initiallyExpanded={rootIds}
            />
        </Field>
    )
}
