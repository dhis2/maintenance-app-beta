import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import { FORM_ERROR } from 'final-form'
import React, { useEffect, useMemo, useRef } from 'react'
import { Form } from 'react-final-form'
import { useNavigate } from 'react-router-dom'
import {
    Loader,
    StandardFormActions,
    StandardFormSection,
} from '../../components'
import { useCustomAttributesQuery } from '../../components/form'
import {
    SCHEMA_SECTIONS,
    getSectionPath,
    useSchemas,
    validate,
} from '../../lib'
import { Attribute } from '../../types/generated'
import { DataElementFormFields, dataElementSchema } from './form'
import type { FormValues } from './form'
import classes from './New.module.css'

const listPath = `/${getSectionPath(SCHEMA_SECTIONS.dataElement)}`

function useInitialValues(customAttributes: Attribute[]) {
    const schemas = useSchemas()

    const attributeValues = useMemo(
        () =>
            customAttributes.map((attribute) => ({
                attribute,
                value: '',
            })),
        [customAttributes]
    )

    return useMemo(
        () => ({
            name: '',
            shortName: '',
            code: '',
            description: '',
            url: '',
            fieldMask: '',
            domainType: 'AGGREGATE',
            formName: '',
            valueType: schemas.dataElement.properties.valueType.constants?.[0],
            aggregationType: 'NONE',
            style: { icon: '', color: '' },
            categoryCombo: { id: '' },
            optionSet: { id: '' },
            commentOptionSet: { id: '' },
            legendSets: [],
            aggregationLevels: [],
            attributeValues,
            zeroIsSignificant: false,
        }),
        [attributeValues, schemas.dataElement.properties.valueType.constants]
    )
}

const ADD_NEW_DATA_ELEMENT_MUTATION = {
    resource: 'dataElements',
    type: 'create',
    data: (de: object) => de,
} as const

function formatFormValues({ values }: { values: FormValues }) {
    return {
        aggregationLevels: values.aggregationLevels,
        aggregationType: values.aggregationType,
        attributeValues: values.attributeValues.filter(({ value }) => !!value),
        categoryCombo: values.categoryCombo.id
            ? values.categoryCombo
            : undefined,
        code: values.code,
        commentOptionSet: values.commentOptionSet.id
            ? values.commentOptionSet
            : undefined,
        description: values.description,
        domainType: values.domainType,
        fieldMask: values.fieldMask,
        formName: values.formName,
        legendSets: values.legendSets,
        name: values.name,
        optionSet: values.optionSet.id ? values.optionSet : undefined,
        shortName: values.shortName,
        style: {
            color: values.style?.color,
            icon: values.style?.icon,
        },
        url: values.url,
        valueType: values.valueType,
        zeroIsSignificant: values.zeroIsSignificant,
    }
}

export const Component = () => {
    const dataEngine = useDataEngine()
    const navigate = useNavigate()
    const customAttributesQuery = useCustomAttributesQuery()
    const initialValues = useInitialValues(customAttributesQuery.data)

    async function onSubmit(values: FormValues) {
        const payload = formatFormValues({ values })

        try {
            // We want the promise so we know when submitting is done. The promise
            // returned by the mutation function of useDataMutation will never
            // resolve
            await dataEngine.mutate(ADD_NEW_DATA_ELEMENT_MUTATION, {
                variables: payload,
            })
        } catch (e) {
            return { [FORM_ERROR]: (e as Error | string).toString() }
        }

        navigate(listPath)
    }

    return (
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
                            onCancelClick={() => navigate(listPath)}
                        />
                    </form>
                )}
            </Form>
        </Loader>
    )
}

function FormContents({
    submitError,
    onCancelClick,
    submitting,
}: {
    submitting: boolean
    onCancelClick: () => void
    submitError?: string
}) {
    const formErrorRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (submitError) {
            formErrorRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [submitError])

    return (
        <>
            <div className={classes.form}>
                <DataElementFormFields />

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

                <StandardFormSection>
                    <StandardFormActions
                        cancelLabel={i18n.t('Exit without saving')}
                        submitLabel={i18n.t('Create data element')}
                        submitting={submitting}
                        onCancelClick={onCancelClick}
                    />
                </StandardFormSection>
            </div>
        </>
    )
}
