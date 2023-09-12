import { useDataEngine } from '@dhis2/app-runtime'
import { Button, ButtonStrip, CircularLoader } from '@dhis2/ui'
import React from 'react'
import { Form } from 'react-final-form'
import { useNavigate } from 'react-router-dom'
import { StandardFormSection } from '../../components'
import { SCHEMA_SECTIONS } from '../../constants'
import { getSectionPath } from '../../lib'
import { Attribute, DataElement } from '../../types/generated'
import { DataElementFormFields, useCustomAttributesQuery } from './form'
import { FormValues } from './form/types'
import classes from './New.module.css'

const listPath = `/${getSectionPath(SCHEMA_SECTIONS.dataElement)}`

function computeInitialValues(customAttributes: Attribute[]) {
    const attributeValues = customAttributes.map((attribute) => ({
        attribute,
        value: '',
    }))

    return {
        name: '',
        shortName: '',
        code: '',
        description: '',
        url: '',
        color: '',
        icon: '',
        fieldMask: '',
        domainType: '',
        formName: '',
        valueType: '',
        aggregationType: '',
        categoryCombo: '',
        optionSet: '',
        commentOptionSet: '',
        legendSets: [],
        aggregationLevels: [],
        attributeValues,
    }
}

const ADD_NEW_DATA_ELEMENT_MUTATION = {
    resource: 'dataElements',
    type: 'create',
    data: (de: object) => de,
} as const

interface FormatFormValuesArgs {
    values: FormValues
    customAttributes: Attribute[]
}

function formatFormValues({ values, customAttributes }: FormatFormValuesArgs) {
    return {
        aggregationLevels:
            values.aggregationLevels?.map((level) => level) || [],
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
            color: values.style?.color,
            icon: values.style?.icon,
        },
        url: values.url,
        valueType: values.valueType,

        // @TODO(DataElements/new): This form value is not present in the specs
        zeroIsSignificant: false,
    }
}

// @TODO(DataElements/new): values dynamic or static?
export const Component = () => {
    const dataEngine = useDataEngine()

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

    const initialValues = computeInitialValues(customAttributesQuery.data)

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
