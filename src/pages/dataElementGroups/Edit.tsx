import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { FormApi } from 'final-form'
import React from 'react'
import { withTypes } from 'react-final-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader } from '../../components'
import {
    DefaultEditFormContents,
    useCustomAttributesQuery,
} from '../../components/form'
import { AttributeMetadata } from '../../components/form/attributes/useCustomAttributesQuery'
import {
    SCHEMA_SECTIONS,
    getSectionPath,
    usePatchModel,
    validate,
} from '../../lib'
import { createJsonPatchOperations } from '../../lib/form/createJsonPatchOperations'
import { getAllAttributeValues } from '../../lib/models/attributes'
import { DataElementGroup } from '../../types/generated'
import { DataElementGroupFormFields, dataElementGroupSchema } from './form'
import type { FormValues } from './form'

type FinalFormFormApi = FormApi<FormValues>

const { Form } = withTypes<FormValues>()

type DataElementGroupQueryResponse = {
    dataElementGroup: DataElementGroup
}

const section = SCHEMA_SECTIONS.dataElementGroup

const query = {
    dataElementGroup: {
        resource: `dataElementGroups`,
        id: ({ id }: Record<string, string>) => id,
        params: {
            fields: ['*', 'attributeValues[*]'],
        },
    },
}

function useDataElementGroupQuery(id: string) {
    return useDataQuery<DataElementGroupQueryResponse>(query, {
        variables: { id },
    })
}

function computeInitialValues({
    dataElementGroup,
    customAttributes,
}: {
    dataElementGroup: DataElementGroup
    customAttributes: AttributeMetadata[]
}) {
    if (!dataElementGroup) {
        return {}
    }

    // We want to have an array in the state with all attributes, not just the
    // ones that are set
    const attributeValues = getAllAttributeValues(
        dataElementGroup.attributeValues,
        customAttributes
    )

    return {
        id: dataElementGroup.id,
        name: dataElementGroup.name,
        shortName: dataElementGroup.shortName,
        code: dataElementGroup.code,
        dataElements: dataElementGroup.dataElements,
        attributeValues,
    } as FormValues
}

export const Component = () => {
    const params = useParams()
    const dataElementGroupId = params.id as string
    const dataElementGroupQuery = useDataElementGroupQuery(dataElementGroupId)
    const attributesQuery = useCustomAttributesQuery()

    const dataElementGroup = dataElementGroupQuery.data?.dataElementGroup

    return (
        <Loader
            queryResponse={dataElementGroupQuery}
            label={i18n.t('Data element group')}
        >
            <Loader
                queryResponse={attributesQuery}
                label={i18n.t('Attributes')}
            >
                <DataElementGroupForm
                    dataElementGroup={dataElementGroup as DataElementGroup}
                    attributes={attributesQuery.data}
                ></DataElementGroupForm>
            </Loader>
        </Loader>
    )
}

function DataElementGroupForm({
    dataElementGroup,
    attributes,
}: {
    dataElementGroup: DataElementGroup
    attributes: AttributeMetadata[]
}) {
    const navigate = useNavigate()
    const patchDirtyFields = usePatchModel(
        dataElementGroup.id,
        section.namePlural
    )

    async function onSubmit(values: FormValues, form: FinalFormFormApi) {
        const jsonPatchOperations = createJsonPatchOperations({
            values,
            dirtyFields: form.getState().dirtyFields,
            originalValue: dataElementGroup,
        })
        const errors = await patchDirtyFields(jsonPatchOperations)

        if (errors) {
            return errors
        }

        navigate(getSectionPath(section))
    }

    return (
        <Form
            validateOnBlur
            onSubmit={onSubmit}
            validate={(values: FormValues) => {
                return validate(dataElementGroupSchema, values)
            }}
            initialValues={computeInitialValues({
                dataElementGroup,
                customAttributes: attributes,
            })}
        >
            {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <DefaultEditFormContents section={section}>
                        <DataElementGroupFormFields />
                    </DefaultEditFormContents>
                </form>
            )}
        </Form>
    )
}
