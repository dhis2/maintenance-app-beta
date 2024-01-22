import { useDataEngine, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import { FORM_ERROR, FormApi } from 'final-form'
import React, { useEffect, useRef } from 'react'
import { withTypes } from 'react-final-form'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Loader,
    StandardFormActions,
    StandardFormSection,
} from '../../components'
import { SCHEMA_SECTIONS, getSectionPath } from '../../lib'
import { JsonPatchOperation } from '../../types'
import { DataElementGroup } from '../../types/generated'
import { createJsonPatchOperations } from './edit/'
import classes from './Edit.module.css'
import { DataElementGroupFormFields, validate } from './form'
import type { FormValues } from './form'

type FinalFormFormApi = FormApi<FormValues>

const { Form } = withTypes<FormValues>()

type DataElementGroupQueryResponse = {
    dataElementGroup: DataElementGroup
}

const listPath = `/${getSectionPath(SCHEMA_SECTIONS.dataElementGroup)}`

function useDataElementGroupQuery(id: string) {
    const DATA_ELEMENT_QUERY = {
        dataElementGroup: {
            resource: `dataElementGroups/${id}`,
            params: {
                fields: ['*', 'attributeValues[*]'],
            },
        },
    }

    return useDataQuery<DataElementGroupQueryResponse>(DATA_ELEMENT_QUERY, {
        variables: { id },
    })
}

function usePatchDirtyFields() {
    const dataEngine = useDataEngine()

    return async ({
        values,
        dirtyFields,
        dataElementGroup,
    }: {
        values: FormValues
        dirtyFields: { [name: string]: boolean }
        dataElementGroup: DataElementGroup
    }) => {
        const jsonPatchPayload = createJsonPatchOperations({
            values,
            dirtyFields,
            originalValue: dataElementGroup,
        })

        // We want the promise so we know when submitting is done. The promise
        // returned by the mutation function of useDataMutation will never
        // resolve
        const ADD_NEW_DATA_ELEMENT_MUTATION = {
            resource: 'dataElementGroups',
            id: values.id,
            type: 'json-patch',
            data: ({ operations }: { operations: JsonPatchOperation[] }) =>
                operations,
        } as const

        try {
            await dataEngine.mutate(ADD_NEW_DATA_ELEMENT_MUTATION, {
                variables: { operations: jsonPatchPayload },
            })
        } catch (e) {
            return { [FORM_ERROR]: (e as Error | string).toString() }
        }
    }
}

export const Component = () => {
    const navigate = useNavigate()
    const params = useParams()
    const dataElementGroupId = params.id as string
    const dataElementGroupQuery = useDataElementGroupQuery(dataElementGroupId)
    const patchDirtyFields = usePatchDirtyFields()

    async function onSubmit(values: FormValues, form: FinalFormFormApi) {
        const errors = await patchDirtyFields({
            values,
            dirtyFields: form.getState().dirtyFields,
            dataElementGroup: dataElementGroupQuery.data
                ?.dataElementGroup as DataElementGroup,
        })

        if (errors) {
            return errors
        }

        navigate(listPath)
    }

    const dataElementGroup = dataElementGroupQuery.data
        ?.dataElementGroup as DataElementGroup
    const initialValues = dataElementGroup
        ? {
              id: dataElementGroupId,
              name: dataElementGroup.name,
              shortName: dataElementGroup.shortName,
              code: dataElementGroup.code,
              description: dataElementGroup.description,
              dataElements: dataElementGroup.dataElements || [],
          }
        : {}

    return (
        <Loader
            queryResponse={dataElementGroupQuery}
            label={i18n.t('Data element group')}
        >
            <Form
                validateOnBlur
                onSubmit={onSubmit}
                validate={validate}
                initialValues={initialValues}
            >
                {({ handleSubmit, submitting, submitError }) => (
                    <form onSubmit={handleSubmit}>
                        <FormContents
                            submitError={submitError}
                            submitting={submitting}
                        />
                    </form>
                )}
            </Form>
        </Loader>
    )
}

function FormContents({
    submitError,
    submitting,
}: {
    submitting: boolean
    submitError?: string
}) {
    const formErrorRef = useRef<HTMLDivElement | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (submitError) {
            formErrorRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [submitError])

    return (
        <>
            {submitError && (
                <StandardFormSection>
                    <div ref={formErrorRef}>
                        <NoticeBox
                            error
                            title={i18n.t(
                                'Something went wrong when submitting the form'
                            )}
                        >
                            {submitError}
                        </NoticeBox>
                    </div>
                </StandardFormSection>
            )}

            <div className={classes.form}>
                <DataElementGroupFormFields />
            </div>

            <div className={classes.formActions}>
                <StandardFormActions
                    cancelLabel={i18n.t('Cancel')}
                    submitLabel={i18n.t('Save and close')}
                    submitting={submitting}
                    onCancelClick={() => navigate(listPath)}
                />
            </div>
        </>
    )
}
