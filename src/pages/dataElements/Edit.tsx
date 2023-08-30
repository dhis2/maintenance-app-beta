import { useDataQuery } from '@dhis2/app-runtime'
import { Button, ButtonStrip, CircularLoader } from '@dhis2/ui'
import React from 'react'
import { Form } from 'react-final-form'
import { useNavigate, useParams } from 'react-router-dom'
import { SCHEMA_SECTIONS } from '../../constants'
import { getSectionPath } from '../../lib'
import { Attribute, DataElement } from '../../types/generated'
import classes from './Edit.module.css'
import { DataElementFormFields, useCustomAttributesQuery } from './form'

type DataElementQueryResponse = {
    dataElement: DataElement
}

const listPath = `/${getSectionPath(SCHEMA_SECTIONS.dataElement)}`

function useDataElementQuery(id: string) {
    const DATA_ELEMENT_QUERY = {
        dataElement: {
            resource: `dataElements/${id}`,
            params: {
                fields: ['*', 'attributeValues[*]'],
            },
        },
    }

    return useDataQuery<DataElementQueryResponse>(DATA_ELEMENT_QUERY, {
        variables: { id },
    })
}

function computeInitialValues({
    dataElement,
    customAttributes,
}: {
    dataElement: DataElement
    customAttributes: Attribute[]
}) {
    const customAttributeInitialValues = customAttributes.reduce(
        (acc, customAttribute) => {
            const attributeValue = dataElement.attributeValues.find(
                (currentAttribute) =>
                    customAttribute.id === currentAttribute.attribute.id
            )

            if (!attributeValue?.value) {
                return { ...acc, [customAttribute.id]: '' }
            }

            if (typeof customAttribute.optionSet?.options === 'undefined') {
                return { ...acc, [customAttribute.id]: attributeValue?.value }
            }

            const selectedOption = customAttribute.optionSet.options.find(
                (option) => option.code === attributeValue.value
            )

            if (!selectedOption) {
                return { ...acc, [customAttribute.id]: '' }
            }

            return {
                ...acc,
                [customAttribute.id]: selectedOption.code,
            }
        },
        {}
    )

    return {
        name: dataElement.name,
        shortName: dataElement.shortName,
        code: dataElement.code,
        description: dataElement.description,
        url: dataElement.url,
        color: dataElement.style?.color,
        icon: dataElement.style?.icon,
        fieldMask: dataElement.fieldMask,
        formName: dataElement.formName,
        valueType: dataElement.valueType,
        aggregationType: dataElement.aggregationType,
        categoryCombo: '', // dataElement.categoryCombo?.id,
        optionSet: '', // dataElement.optionSet,
        commentOptionSet: '', // dataElement.commentOptionSet,
        legendSet: [], // dataElement.legendSet || [],
        aggregationLevels: dataElement.aggregationLevels,
        attributeValues: customAttributeInitialValues,
    }
}

export const Component = () => {
    const navigate = useNavigate()
    const params = useParams()

    const dataElementQuery = useDataElementQuery(params.id as string)
    const customAttributesQuery = useCustomAttributesQuery()

    const onSubmit = (values: object) => {
        console.log(
            '@TODO(DataElements/edit): Implement onSubmit; values:',
            values
        )
    }

    const loading = dataElementQuery.loading || customAttributesQuery.loading
    const error = dataElementQuery.error || customAttributesQuery.error

    if (error && !loading) {
        // @TODO(Edit): Implement error screen
        return `Error: ${error.toString()}`
    }

    if (loading) {
        // @TODO(Edit): Implement loading screen
        return 'Loading...'
    }

    const initialValues = computeInitialValues({
        dataElement: dataElementQuery.data?.dataElement as DataElement,
        customAttributes: customAttributesQuery.data,
    })

    return (
        <Form onSubmit={onSubmit} initialValues={initialValues}>
            {({ handleSubmit, submitting }) => (
                <form onSubmit={handleSubmit}>
                    <div className={classes.form}>
                        <DataElementFormFields />
                    </div>

                    <div className={classes.formActions}>
                        <ButtonStrip>
                            <Button primary disabled={submitting} type="submit">
                                {submitting && (
                                    <span
                                        className={
                                            classes.saveButtonLoadingIcon
                                        }
                                    >
                                        <CircularLoader small />
                                    </span>
                                )}
                                Save and close
                            </Button>

                            <Button
                                disabled={submitting}
                                onClick={() => navigate(listPath)}
                            >
                                Cancel
                            </Button>
                        </ButtonStrip>
                    </div>
                </form>
            )}
        </Form>
    )
}
