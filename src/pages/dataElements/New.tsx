import { useDataEngine } from '@dhis2/app-runtime'
import { Button, ButtonStrip, CircularLoader } from '@dhis2/ui'
import React from 'react'
import { Form } from 'react-final-form'
import { useNavigate } from 'react-router-dom'
import { StandardFormSection } from '../../components'
import { SCHEMA_SECTIONS } from '../../constants'
import { getSectionPath } from '../../lib'
import { Attribute } from '../../types/generated'
import { DataElementFormFields, useCustomAttributesQuery } from './form'
import { FormValues } from './form/FormValues'
import classes from './New.module.css'

const listPath = `/${getSectionPath(SCHEMA_SECTIONS.dataElement)}`

const ADD_NEW_DATA_ELEMENT_MUTATION = {
    resource: 'dataElements',
    type: 'create',
    data: (de: object) => de,
} as const

const formatFormValues = ({
    values,
    customAttributes,
}: {
    values: FormValues
    customAttributes: Attribute[]
}) => {
    const payload = {
        aggregationLevels:
            values.aggregationLevels?.map((level) => parseInt(level, 10)) || [],
        aggregationType: values.aggregationType,
        attributeValues: Object.entries(values.attributeValues || {}).map(
            ([attributeId, value]) => {
                const customAttribute = customAttributes.find(
                    ({ id }) => id === attributeId
                ) as Attribute
                return {
                    value,
                    attribute: { id: attributeId, name: customAttribute.name },
                }
            }
        ),
        categoryCombo: { id: values.categoryCombo },
        code: values.code,
        commentOptionSet: { id: values.commentOptionSet },
        description: values.description,
        domainType: values.domainType,
        fieldMask: values.fieldMask,
        formName: values.formName,
        legendSets: values.legendSet || [],
        name: values.name,
        optionSet: { id: values.optionSet },
        shortName: values.shortName,
        style: {
            color: values.color,
            icon: values.icon,
        },
        url: values.url,
        valueType: values.valueType,

        // @TODO(DataElements/new): This form value is not present in the specs
        zeroIsSignificant: false,
    }

    // @TODO(DataElements/new): Do something with this value!
    return payload
}

export const Component = () => {
    const dataEngine = useDataEngine()

    // @TODO(DataElements/new): values dynamic or static?
    const initialValues = {
        legends: [],
        domain: 'aggregate',
        valueType: 'NUMBER',
        aggregationType: 'SUM',
        legendSet: [],
    }

    const navigate = useNavigate()
    const customAttributesQuery = useCustomAttributesQuery()

    const loading = customAttributesQuery.loading
    const error = customAttributesQuery.error

    if (error && !loading) {
        // @TODO(Edit): Implement error screen
        return `Error: ${error.toString()}`
    }

    if (loading) {
        // @TODO(Edit): Implement loading screen
        return 'Loading...'
    }

    function onSubmit(values: FormValues) {
        const payload = formatFormValues({
            values,
            customAttributes: customAttributesQuery.data,
        })

        // We want the promise so we know when submitting is done. The promise
        // returned by the mutation function of useDataMutation will never
        // resolve
        return dataEngine.mutate(ADD_NEW_DATA_ELEMENT_MUTATION, {
            variables: payload,
        })
    }

    return (
        <Form onSubmit={onSubmit} initialValues={initialValues}>
            {({ handleSubmit, submitting }) => (
                <form onSubmit={handleSubmit}>
                    <div className={classes.form}>
                        <DataElementFormFields />

                        <StandardFormSection>
                            <ButtonStrip>
                                <Button
                                    primary
                                    disabled={submitting}
                                    type="submit"
                                >
                                    {submitting && (
                                        <span
                                            className={
                                                classes.saveButtonLoadingIcon
                                            }
                                        >
                                            <CircularLoader small />
                                        </span>
                                    )}
                                    Create data element
                                </Button>

                                <Button
                                    disabled={submitting}
                                    onClick={() => navigate(listPath)}
                                >
                                    Exit without saving
                                </Button>
                            </ButtonStrip>
                        </StandardFormSection>
                    </div>
                </form>
            )}
        </Form>
    )
}
