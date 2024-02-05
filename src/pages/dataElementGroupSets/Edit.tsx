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
import { DataElementGroupSet } from '../../types/generated'
import { createJsonPatchOperations } from './edit/'
import classes from './Edit.module.css'
import { DataElementGroupSetFormFields, validate } from './form'
import type { FormValues } from './form'

type FinalFormFormApi = FormApi<FormValues>

const { Form } = withTypes<FormValues>()

type DataElementGroupSetQueryResponse = {
    dataElementGroupSet: DataElementGroupSet
}

const listPath = `/${getSectionPath(SCHEMA_SECTIONS.dataElementGroupSet)}`

function useDataElementGroupSetQuery(id: string) {
    const DATA_ELEMENT_QUERY = {
        dataElementGroupSet: {
            resource: `dataElementGroupSets/${id}`,
            params: {
                fields: ['*', 'attributeValues[*]'],
            },
        },
    }

    return useDataQuery<DataElementGroupSetQueryResponse>(DATA_ELEMENT_QUERY, {
        variables: { id },
    })
}

function usePatchDirtyFields() {
    const dataEngine = useDataEngine()

    return async ({
        values,
        dirtyFields,
        dataElementGroupSet,
    }: {
        values: FormValues
        dirtyFields: { [name: string]: boolean }
        dataElementGroupSet: DataElementGroupSet
    }) => {
        const jsonPatchPayload = createJsonPatchOperations({
            values,
            dirtyFields,
            originalValue: dataElementGroupSet,
        })

        // We want the promise so we know when submitting is done. The promise
        // returned by the mutation function of useDataMutation will never
        // resolve
        const ADD_NEW_DATA_ELEMENT_MUTATION = {
            resource: 'dataElementGroupSets',
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
    const dataElementGroupSetId = params.id as string
    const dataElementGroupSetQuery = useDataElementGroupSetQuery(
        dataElementGroupSetId
    )
    const patchDirtyFields = usePatchDirtyFields()

    async function onSubmit(values: FormValues, form: FinalFormFormApi) {
        const errors = await patchDirtyFields({
            values,
            dirtyFields: form.getState().dirtyFields,
            dataElementGroupSet: dataElementGroupSetQuery.data
                ?.dataElementGroupSet as DataElementGroupSet,
        })

        if (errors) {
            return errors
        }

        navigate(listPath)
    }

    const dataElementGroupSet = dataElementGroupSetQuery.data
        ?.dataElementGroupSet as DataElementGroupSet
    const initialValues = dataElementGroupSet
        ? {
              id: dataElementGroupSetId,
              name: dataElementGroupSet.name,
              shortName: dataElementGroupSet.shortName,
              code: dataElementGroupSet.code,
              description: dataElementGroupSet.description,
              compulsory: dataElementGroupSet.compulsory,
              dataDimension: dataElementGroupSet.dataDimension,
              dataElementGroups: dataElementGroupSet.dataElementGroups || [],
          }
        : {}

    return (
        <Loader
            queryResponse={dataElementGroupSetQuery}
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
                <DataElementGroupSetFormFields />
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
