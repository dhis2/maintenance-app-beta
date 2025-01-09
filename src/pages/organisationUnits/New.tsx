import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { FormApi } from 'final-form'
import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { OrganisationUnit } from '../../types/generated'
import {
    FormValues,
    initialValues,
    OrganisationUnitFormField,
    validate,
} from './form'

const section = SECTIONS_MAP.organisationUnit

export const Component = () => {
    const onSubmit = useOnSubmitNew({ section })
    const dataEngine = useDataEngine()
    const warning = useAlert(
        ({ message }) => message,
        (options) => options
    )
    const handleOnSubmit = async (values: FormValues, form: FormApi) => {
        const createOrgUnitResponse = await onSubmit(values, form)
        const orgId = createOrgUnitResponse?.response?.response?.uid
        const fieldToSaveSeparately = [
            'dataSets',
            'programs',
        ] as (keyof OrganisationUnit)[]

        const fieldToEditSeparatelyResults = await Promise.allSettled(
            fieldToSaveSeparately.map((field) =>
                dataEngine.mutate({
                    resource: `organisationUnits`,
                    type: 'update',
                    data: { identifiableObjects: values[field] },
                    id: `${orgId}/${field}`,
                })
            )
        )

        const fieldToEditSeparatelyErrors = fieldToSaveSeparately
            .map((field, index) =>
                fieldToEditSeparatelyResults[index].status === 'rejected'
                    ? field
                    : undefined
            )
            .filter((field) => !!field)

        if (fieldToEditSeparatelyErrors.length > 0) {
            warning.show({
                message: i18n.t(
                    `The organisation unit was created correctly but there was a problem saving ${fieldToEditSeparatelyErrors.join(
                        ' and '
                    )}`
                ),
                warning: true,
            })
        }
    }

    return (
        <FormBase
            onSubmit={handleOnSubmit}
            initialValues={initialValues}
            validate={validate}
        >
            <DefaultNewFormContents section={section}>
                <OrganisationUnitFormField />
            </DefaultNewFormContents>
        </FormBase>
    )
}
