// @ts-nocheck
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
import { useCustomAttributesQuery } from '../../components/form'
import { SCHEMA_SECTIONS, getSectionPath, validate } from '../../lib'
import { createJsonPatchOperations } from '../../lib/form/createJsonPatchOperations'
import { getAllAttributeValues } from '../../lib/models/attributes'
import { JsonPatchOperation } from '../../types'
import { Attribute, DataElement } from '../../types/generated'
import classes from './Edit.module.css'
import { DataElementFormFields, dataElementSchema } from './form'
import type { DataElementFormValues } from './form'

type FinalFormFormApi = FormApi<DataElementFormValues>

const { Form } = withTypes<DataElementFormValues>()

type DataElementQueryResponse = {
    dataElement: DataElementFormValues
}

const listPath = `/${getSectionPath(SCHEMA_SECTIONS.dataElement)}`

export const fieldFilters = [
    'id',
    'displayName',
    'code',
    'shortName',
    'description',
    'url',
    'style',
    'fieldMask',
    'domainType',
    'formName',
    'valueType',
    'aggregationType',
    'categoryCombo[id,displayName]',
    'optionSet[id,displayName,valueType]',
    'commentOptionSet[id,displayName]',
    'legendSets[id,displayName]',
    'aggregationLevels',
    'zeroIsSignificant',
    'attributeValues[value,attribute[id,displayName]]',
] as const

// const fieldFilterObj = {
//     ['id', { root: 'optionSet', 'fields': ['']}]
// }

function useDataElementQuery(id: string) {
    const DATA_ELEMENT_QUERY = {
        dataElement: {
            resource: `dataElements`,
            id: ({ id }: Record<string, string>) => id,
            params: {
                fields: fieldFilters.concat(),
            },
        },
    }

    return useDataQuery<DataElementQueryResponse>(DATA_ELEMENT_QUERY, {
        variables: { id },
    })
}

const computeDefaultValues = (initialValues): Partial<DataElementFormFields> => {
    return {
        ...initialValues,
    }
}

function computeInitialValues({
    dataElement,
    customAttributes,
}: {
    dataElement: DataElement
    customAttributes: Attribute[]
}): DataElementFormValues {
    if (!dataElement) {
        throw new Error('Data element not found')
    }

    const attributeValues = getAllAttributeValues(dataElement, customAttributes)

    return {
        ...dataElement,
        attributeValues,
    }
}

function usePatchDirtyFields() {
    const dataEngine = useDataEngine()

    return async ({
        values,
        dirtyFields,
        dataElement,
    }: {
        values: DataElementFormValues
        dirtyFields: { [name: string]: boolean }
        dataElement: DataElement
    }) => {
        const jsonPatchPayload = createJsonPatchOperations({
            values,
            dirtyFields,
            originalValue: dataElement,
        })

        // We want the promise so we know when submitting is done. The promise
        // returned by the mutation function of useDataMutation will never
        // resolve
        const ADD_NEW_DATA_ELEMENT_MUTATION = {
            resource: 'dataElements',
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
    const dataElementId = params.id as string
    const dataElementQuery = useDataElementQuery(dataElementId)
    const customAttributesQuery = useCustomAttributesQuery()
    const patchDirtyFields = usePatchDirtyFields()

    async function onSubmit(
        values: DataElementFormValues,
        form: FinalFormFormApi
    ) {
        const errors = await patchDirtyFields({
            values,
            dirtyFields: form.getState().dirtyFields,
            dataElement: dataElementQuery.data?.dataElement as DataElement,
        })

        if (errors) {
            return errors
        }

        navigate(listPath)
    }

    const initialValues = computeInitialValues({
        dataElement: dataElementQuery.data?.dataElement as DataElement,
        customAttributes: customAttributesQuery.data || [],
    })

    return (
        <Loader queryResponse={dataElementQuery} label={i18n.t('Data element')}>
            <Loader
                queryResponse={customAttributesQuery}
                label={i18n.t('Custom attributes')}
            >
                <Form
                    validateOnBlur
                    onSubmit={onSubmit}
                    validate={(values: DataElementFormValues) => {
                        return validate(dataElementSchema, values)
                    }}
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
                <DataElementFormFields />
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


type StepKind = "goto" | "waitForSelector"

type StepKindObject<TStepKind extends StepKind> = {
    [key in TStepKind]: string
}

type Step = StepKindObject<"goto"> |  StepKindObject<"waitForSelector">

const s = {} as Step

s.
