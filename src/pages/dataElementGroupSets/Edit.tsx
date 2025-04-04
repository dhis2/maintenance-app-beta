import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { FormApi } from 'final-form'
import React from 'react'
import { withTypes } from 'react-final-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader } from '../../components'
import { DefaultEditFormContents } from '../../components/form'
import {
    SCHEMA_SECTIONS,
    getSectionPath,
    usePatchModel,
    validate,
} from '../../lib'
import { createJsonPatchOperations } from '../../lib/form/createJsonPatchOperations'
import {
    getAllAttributeValues,
    AttributeMetadata,
    useCustomAttributesQuery,
} from '../../lib/models/attributes'
import { DataElementGroupSet } from '../../types/generated'
import {
    DataElementGroupSetFormFields,
    dataElementGroupSetSchema,
} from './form'
import type { FormValues } from './form'

type FinalFormFormApi = FormApi<FormValues>

const { Form } = withTypes<FormValues>()

type DataElementGroupSetQueryResponse = {
    dataElementGroupSet: DataElementGroupSet
}

const section = SCHEMA_SECTIONS.dataElementGroupSet
const listPath = `/${getSectionPath(section)}`

const query = {
    dataElementGroupSet: {
        resource: `dataElementGroupSets`,
        id: ({ id }: Record<string, string>) => id,
        params: {
            fields: ['*', 'attributeValues[*]'],
        },
    },
}

function useDataElementGroupSetQuery(id: string) {
    return useDataQuery<DataElementGroupSetQueryResponse>(query, {
        variables: { id },
    })
}

function computeInitialValues({
    dataElementGroupSet,
    customAttributes,
}: {
    dataElementGroupSet: DataElementGroupSet
    customAttributes: AttributeMetadata[]
}) {
    if (!dataElementGroupSet) {
        return {}
    }

    // We want to have an array in the state with all attributes, not just the
    // ones that are set
    const attributeValues = getAllAttributeValues(
        dataElementGroupSet.attributeValues,
        customAttributes
    )

    return {
        id: dataElementGroupSet.id,
        name: dataElementGroupSet.name,
        shortName: dataElementGroupSet.shortName,
        code: dataElementGroupSet.code,
        description: dataElementGroupSet.description,
        compulsory: dataElementGroupSet.compulsory,
        dataDimension: dataElementGroupSet.dataDimension,
        dataElementGroups: dataElementGroupSet.dataElementGroups || [],
        attributeValues,
    } as FormValues
}

export const Component = () => {
    const params = useParams()
    const dataElementGroupSetId = params.id as string
    const dataElementGroupSetQuery = useDataElementGroupSetQuery(
        dataElementGroupSetId
    )
    const attributesQuery = useCustomAttributesQuery()

    const dataElementGroupSet =
        dataElementGroupSetQuery.data?.dataElementGroupSet

    return (
        <Loader
            queryResponse={dataElementGroupSetQuery}
            label={i18n.t('Data element group set')}
        >
            <Loader
                queryResponse={attributesQuery}
                label={i18n.t('Attributes')}
            >
                <DataElementGroupSetForm
                    dataElementGroupSet={
                        dataElementGroupSet as DataElementGroupSet
                    }
                    attributes={attributesQuery.data}
                ></DataElementGroupSetForm>
            </Loader>
        </Loader>
    )
}

function DataElementGroupSetForm({
    dataElementGroupSet,
    attributes,
}: {
    dataElementGroupSet: DataElementGroupSet
    attributes: AttributeMetadata[]
}) {
    const navigate = useNavigate()
    const patchDirtyFields = usePatchModel(
        dataElementGroupSet.id,
        section.namePlural
    )

    async function onSubmit(values: FormValues, form: FinalFormFormApi) {
        const jsonPatchOperations = createJsonPatchOperations({
            values,
            dirtyFields: form.getState().dirtyFields,
            originalValue: dataElementGroupSet,
        })
        const errors = await patchDirtyFields(jsonPatchOperations)

        if (errors) {
            return errors
        }

        navigate(listPath)
    }

    return (
        <Form
            validateOnBlur
            onSubmit={onSubmit}
            validate={(values: FormValues) => {
                return validate(dataElementGroupSetSchema, values)
            }}
            initialValues={computeInitialValues({
                dataElementGroupSet,
                customAttributes: attributes,
            })}
        >
            {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <DefaultEditFormContents section={section}>
                        <DataElementGroupSetFormFields />
                    </DefaultEditFormContents>
                </form>
            )}
        </Form>
    )
}
