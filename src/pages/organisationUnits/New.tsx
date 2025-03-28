import { useQueryClient } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import {
    getSectionPath,
    SECTIONS_MAP,
    useNavigateWithSearchState,
} from '../../lib'
import { createFormError } from '../../lib/form/createFormError'
import { useCreateModel } from '../../lib/form/useCreateModel'
import { initialValues, OrganisationUnitFormField, validate } from './form'
import { OrganisationUnitFormValues } from './form/organisationUnitSchema'
import { useOnSaveDataSetsAndPrograms } from './form/useOnSaveDataSetsAndPrograms'

const section = SECTIONS_MAP.organisationUnit

export const useOnSaveOrgUnits = () => {
    const createModel = useCreateModel(section.namePlural)
    const queryClient = useQueryClient()
    const updateDataSetsAndPrograms = useOnSaveDataSetsAndPrograms()
    const navigate = useNavigateWithSearchState()

    return useMemo(
        () => async (values: OrganisationUnitFormValues) => {
            const { dataSets, programs, ...restFields } = values

            const { data, error } = await createModel(restFields)
            if (error) {
                return createFormError(error)
            }
            const orgId = (data as { response: { uid: string } }).response.uid

            await updateDataSetsAndPrograms(orgId, { dataSets, programs })

            queryClient.invalidateQueries({
                queryKey: [{ resource: section.namePlural }],
            })
            navigate(`/${getSectionPath(section)}`)
        },
        [createModel, navigate, updateDataSetsAndPrograms, queryClient]
    )
}

export const Component = () => {
    const onSubmit = useOnSaveOrgUnits()

    return (
        <FormBase
            onSubmit={onSubmit}
            initialValues={initialValues}
            validate={validate}
        >
            <DefaultNewFormContents section={section}>
                <OrganisationUnitFormField />
            </DefaultNewFormContents>
        </FormBase>
    )
}
