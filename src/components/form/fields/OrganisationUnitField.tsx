import i18n from '@dhis2/d2-i18n'
import {
    Field,
    OrganisationUnitTree,
    OrganisationUnitTreeProps,
} from '@dhis2/ui'
import React, {useEffect, useState} from 'react'
import { useField } from 'react-final-form'
import { useCurrentUserRootOrgUnits } from '../../../lib/user/currentUserStore'
import classes from './OrganisationUnitField.module.css'
import {ModelMultiSelect} from "../../metadataFormControls";

type OrganisationUnitFieldProps = {
    name?: string
    label?: string
    singleSelection?: boolean
    onChange?: (orgUnits: OrganisationUnitFormValue[]) => void
    withLevelSelector?: boolean
}

export type OrganisationUnitFormValue = {
    id: string
    path: string
    displayName: string
}

const orgUnitLevelQuery = {
    resource: 'organisationUnitLevels',
    params: {
        fields: ['id', 'displayName', 'level'],
        order: 'level:asc',
    },
}

export const OrganisationUnitField = ({
    name,
    onChange,
    label,
    singleSelection = false,
    withLevelSelector = false,
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
    const queryFn = useBoundResourceQueryFn()
    const [orgUnitLevels, setOrgUnitLevels] = useState([])

    const levelQuery = useQuery({
        queryKey: [
            {
                resource: 'organisationUnits',
                params: {
                    fields: ['id', 'displayName', 'path'],
                    filter: [
                        `level:in:[${orgUnitLevels
                            .map((level) => level.level)
                            .join(',')}]`,
                    ],
                },
            },
        ],
        queryFn: queryFn<OrganisationUnitFormValue>,
        enabled: orgUnitLevels.length > 0,
    })
    console.log('*************DATA', levelQuery?.data)

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
            label={label ?? i18n.t('Select organisation units')}
            error={meta.touched && meta.error}
            validationText={meta.touched && meta.error}
        >
            <div className={classes.OrganisationUnitTreeWrapper}>
                <OrganisationUnitTree
                    roots={rootIds}
                    singleSelection={singleSelection}
                    onChange={handleChange}
                    selected={selectedPaths}
                    initiallyExpanded={rootIds}
                />
            </div>
            {withLevelSelector && (
                <ModelMultiSelect
                    query={orgUnitLevelQuery}
                    onChange={(orgUnits) => {
                        setOrgUnitLevels(orgUnits.selected)
                    }}
                    selected={orgUnitLevels}
                />
            )}
        </Field>
    )
}
