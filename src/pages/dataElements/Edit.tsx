import { useDataEngine, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import { FORM_ERROR, FormApi } from 'final-form'
import React, { useEffect, useRef } from 'react'
import { withTypes } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    Loader,
    StandardFormActions,
    StandardFormSection,
} from '../../components'
import {
    SCHEMA_SECTIONS,
    getSectionPath,
    useNavigateWithSearchState,
    validate,
} from '../../lib'
import { createJsonPatchOperations } from '../../lib/form/createJsonPatchOperations'
import {
    getAllAttributeValues,
    AttributeMetadata,
    useCustomAttributesQuery,
} from '../../lib/models/attributes'
import { JsonPatchOperation } from '../../types'
import { DataElement } from '../../types/generated'
import classes from './Edit.module.css'
import { DataElementFormFields, dataElementSchema } from './form'
import type { FormValues } from './form'

type FinalFormFormApi = FormApi<FormValues>

const { Form } = withTypes<FormValues>()

type DataElementQueryResponse = {
    dataElement: DataElement
}

const listPath = `/${getSectionPath(SCHEMA_SECTIONS.dataElement)}`

function useDataElementQuery(id: string) {
    const DATA_ELEMENT_QUERY = {
        dataElement: {
            resource: `dataElements/${id}`,
            params: {
                fields: [
                    '*',
                    'categoryCombo[id,displayName]',
                    'attributeValues[*]',
                ],
            },
        },
    }

    return useDataQuery<DataElementQueryResponse>(DATA_ELEMENT_QUERY, {
        variables: { id },
    })
}

function computeInitialValues({
    dataElementId,
    dataElement,
    customAttributes,
}: {
    dataElement: DataElement
    customAttributes: AttributeMetadata[]
    dataElementId: string
}) {
    if (!dataElement) {
        return {}
    }

    const attributeValues = getAllAttributeValues(
        dataElement.attributeValues,
        customAttributes
    )

    return {
        id: dataElementId,
        name: dataElement.name,
        shortName: dataElement.shortName,
        code: dataElement.code,
        description: dataElement.description,
        url: dataElement.url,
        style: {
            color: dataElement.style?.color,
            icon: dataElement.style?.icon,
        },
        fieldMask: dataElement.fieldMask,
        domainType: dataElement.domainType,
        formName: dataElement.formName,
        valueType: dataElement.valueType,
        aggregationType: dataElement.aggregationType,
        categoryCombo: dataElement.categoryCombo || { id: '' },
        optionSet: dataElement.optionSet || { id: '' },
        commentOptionSet: dataElement.commentOptionSet || { id: '' },
        legendSets: dataElement.legendSets || [],
        aggregationLevels: dataElement.aggregationLevels || [],
        zeroIsSignificant: dataElement.zeroIsSignificant,
        attributeValues,
    } as FormValues
}

function usePatchDirtyFields() {
    const dataEngine = useDataEngine()

    return async ({
        values,
        dirtyFields,
        dataElement,
    }: {
        values: FormValues
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
    const navigate = useNavigateWithSearchState()
    const params = useParams()
    const dataElementId = params.id as string
    const dataElementQuery = useDataElementQuery(dataElementId)
    const customAttributesQuery = useCustomAttributesQuery()
    const patchDirtyFields = usePatchDirtyFields()

    async function onSubmit(values: FormValues, form: FinalFormFormApi) {
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
        dataElementId,
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
                    validate={(values: FormValues) => {
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
    const navigate = useNavigateWithSearchState()

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
