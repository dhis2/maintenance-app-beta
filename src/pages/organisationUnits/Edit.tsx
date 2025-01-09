import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { FormApi } from 'final-form'
import React, { useMemo } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { DefaultEditFormContents, FormBase } from '../../components'
import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    DEFAULT_FIELD_FILTERS,
    getSectionPath,
    SECTIONS_MAP,
    useNavigateWithSearchState,
    usePatchModel,
} from '../../lib'
import { createJsonPatchOperations } from '../../lib/form/createJsonPatchOperations'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { DataEngine } from '../../types'
import { OrganisationUnit, PickWithFieldFilters } from '../../types/generated'
import { FormValues, OrganisationUnitFormField, validate } from './form'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'code',
    'shortName',
    'openingDate',
    'closedDate',
    'comment',
    'image[id,name]',
    'description',
    'contactPerson',
    'address',
    'email',
    'phoneNumber',
    'url',
    'geometry',
    'dataSets[id,displayName]',
    'programs[id,displayName]',
    'level',
    'path',
    'parent[id,path, displayName]',
] as const

export type OrgUnitFormValues = PickWithFieldFilters<
    OrganisationUnit,
    typeof fieldFilters
>

const section = SECTIONS_MAP.organisationUnit

export const useOnEditOrgUnits = (modelId: string) => {
    const patchDirtyFields = usePatchModel(modelId, section.namePlural)
    const queryClient = useQueryClient()
    const dataEngine: DataEngine = useDataEngine()
    const navigate = useNavigateWithSearchState()
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )

    return useMemo(
        () => async (values: FormValues, form: FormApi<FormValues>) => {
            const { dataSets, programs, ...rest } = values
            const dirtyFields = form.getState().dirtyFields
            const fieldToEditSeparately = [
                'dataSets',
                'programs',
            ] as (keyof OrganisationUnit)[]
            const fieldToEditSeparatelyHaveBeenModified = Object.keys(
                dirtyFields
            ).some((field) =>
                (fieldToEditSeparately as string[]).includes(field)
            )

            const orgUnitJsonPatchOperations = createJsonPatchOperations({
                values: rest,
                dirtyFields,
                originalValue: form.getState().initialValues,
                omit: fieldToEditSeparately,
            })

            if (
                orgUnitJsonPatchOperations.length < 1 &&
                !fieldToEditSeparatelyHaveBeenModified
            ) {
                saveAlert.show({
                    message: i18n.t('No changes to be saved'),
                })
                navigate(`/${getSectionPath(section)}`)
                return
            }

            const orgUnitErrors = await patchDirtyFields(
                orgUnitJsonPatchOperations
            )
            if (orgUnitErrors) {
                return orgUnitErrors
            }

            queryClient.invalidateQueries({
                queryKey: [{ resource: section.namePlural }],
            })
            navigate(`/${getSectionPath(section)}`)

            const fieldToEditSeparatelyResults = await Promise.allSettled(
                fieldToEditSeparately.map((field) =>
                    dataEngine.mutate({
                        resource: `organisationUnits`,
                        type: 'update',
                        data: { identifiableObjects: values[field] },
                        id: `${modelId}/${field}`,
                    })
                )
            )

            const fieldToEditSeparatelyErrors = fieldToEditSeparately
                .map((field, index) =>
                    fieldToEditSeparatelyResults[index].status === 'rejected'
                        ? field
                        : undefined
                )
                .filter((field) => !!field)

            if (fieldToEditSeparatelyErrors.length > 0) {
                saveAlert.show({
                    message: i18n.t(
                        `The organisation unit was updated correctly but there was a problem saving ${fieldToEditSeparatelyErrors.join(
                            ' and '
                        )}`
                    ),
                    warning: true,
                })
            } else {
                saveAlert.show({
                    message: i18n.t('Saved successfully'),
                    success: true,
                })
            }
        },
        [patchDirtyFields, saveAlert, navigate, section]
    )
}

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string
    const onSubmit = useOnEditOrgUnits(modelId)

    const query = {
        resource: 'organisationUnits',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const orgUnit = useQuery({
        queryKey: [query],
        queryFn: queryFn<OrgUnitFormValues>,
    })

    return (
        <FormBase
            onSubmit={onSubmit}
            initialValues={orgUnit.data}
            validate={validate}
        >
            <DefaultEditFormContents section={section}>
                <OrganisationUnitFormField />
            </DefaultEditFormContents>
        </FormBase>
    )
}
