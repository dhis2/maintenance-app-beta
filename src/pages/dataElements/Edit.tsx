import { useDataQuery } from '@dhis2/app-runtime'
import { Button, ButtonStrip } from '@dhis2/ui'
import React from 'react'
import { Form } from 'react-final-form'
import { useNavigate, useParams } from 'react-router-dom'
import { DataElement } from '../../types/generated'
import classes from './Edit.module.css'
import { DataElementForm, useCustomAttributesQuery } from './form'

type DataElementQueryResponse = {
    dataElement: DataElement
}

function useDataElementQuery(id: string) {
    const DATA_ELEMENT_QUERY = {
        dataElement: {
            resource: `dataElements/${id}`,
            params: {
                fields: ['*'],
            },
        },
    }

    return useDataQuery<DataElementQueryResponse>(DATA_ELEMENT_QUERY, {
        variables: { id },
    })
}

// @TODO(DataElements/edit): I suppose we want some of the initial values to be
//   dynamic? In that case, we'd have to load them and add loading/error UIs.
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

    const dataElement = dataElementQuery.data?.dataElement as DataElement
    const customAttributes = customAttributesQuery.data
    const customAttributeInitialValues = customAttributes.reduce(
        (acc, customAttribute) => {
            const attributeValue = dataElement.attributeValues.find(
                (currentAttribute) =>
                    customAttribute.id === currentAttribute.attribute.id
            )

            return {
                ...acc,
                [customAttribute.id]: attributeValue?.value || '',
            }
        },
        {}
    )

    const initialValues = {
        name: dataElement.name,
        shortName: dataElement.shortName,
        code: dataElement.code,
        description: dataElement.description,
        url: dataElement.url,
        color: dataElement.style.color,
        icon: dataElement.style.icon,
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

    return (
        <Form onSubmit={onSubmit} initialValues={initialValues}>
            {({ handleSubmit, submitting }) => (
                <form onSubmit={handleSubmit}>
                    <div className={classes.form}>
                        <DataElementForm />
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
