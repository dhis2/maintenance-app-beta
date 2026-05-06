import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Form } from 'react-final-form'
import {
    createFormError,
    getSectionPath,
    SECTIONS_MAP,
    useBoundResourceQueryFn,
    useLocationWithState,
    useNavigateWithSearchState,
} from '../../lib'
import { MoveFormContent } from './move/MoveFormContents'
import {
    moveOrgUnitFormValidate,
    MoveOrgUnitFormValues,
} from './move/MoveOrgUnitSchema'

type OrgUnit = {
    id: string
    path: string
    displayName: string
}

type OrgUnitPathResponse = {
    organisationUnits: OrgUnit[]
}

const ORG_UNIT_RESOURCE = SECTIONS_MAP.organisationUnit.namePlural

export const Component = () => {
    const location = useLocationWithState<{ selectedModels: Set<string> }>()
    const queryFn = useBoundResourceQueryFn()
    const dataEngine = useDataEngine()
    const navigate = useNavigateWithSearchState()
    const queryClient = useQueryClient()
    const { show: showSuccess } = useAlert(
        i18n.t('Organisation units successfully moved'),
        { success: true }
    )

    const preselectedIds: string[] = useMemo(
        () => Array.from(location.state?.selectedModels ?? []),
        [location.state?.selectedModels]
    )

    const { data: preselectedData } = useQuery({
        queryKey: [
            {
                resource: 'organisationUnits',
                params: {
                    fields: ['id', 'path', 'displayName'],
                    filter: `id:in:[${preselectedIds.join(',')}]`,
                    paging: false,
                },
            },
        ],
        queryFn: queryFn<OrgUnitPathResponse>,
        enabled: preselectedIds.length > 0,
    })

    const initialValues: MoveOrgUnitFormValues = useMemo(
        () => ({
            target: undefined,
            sources: preselectedData?.organisationUnits ?? [],
        }),
        [preselectedData]
    )

    const onSubmit = async (values: MoveOrgUnitFormValues) => {
        const moveResults = await Promise.allSettled(
            values.sources.map((source) =>
                dataEngine.mutate({
                    resource: ORG_UNIT_RESOURCE,
                    id: source.id,
                    type: 'json-patch',
                    data: [
                        {
                            op: 'replace',
                            path: '/parent',
                            value: { id: values.target!.id },
                        },
                    ],
                } as const)
            )
        )

        const moveFailures = moveResults
            .map((result, index) => ({
                ...result,
                orgUnitName: values.sources[index].displayName,
            }))
            .filter((result) => result.status === 'rejected')

        queryClient.invalidateQueries({
            queryKey: [{ resource: ORG_UNIT_RESOURCE }],
        })

        if (moveFailures.length > 0) {
            return createFormError({
                message: i18n.t(
                    'There was an error moving organisation units: {{orgUnitNames}}',
                    {
                        orgUnitNames: moveFailures
                            .map((f) => f.orgUnitName)
                            .join(', '),
                        nsSeparator: '~-~',
                    }
                ),
            })
        }

        showSuccess()
        navigate(`/${getSectionPath(ORG_UNIT_RESOURCE)}`)
    }

    return (
        <Form
            initialValues={initialValues}
            onSubmit={onSubmit}
            validate={moveOrgUnitFormValidate}
            subscription={{
                values: false,
                submitting: true,
                submitSucceeded: true,
            }}
        >
            {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <MoveFormContent />
                </form>
            )}
        </Form>
    )
}
