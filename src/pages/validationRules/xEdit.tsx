import i18n from '@dhis2/d2-i18n'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { DefaultEditFormContents, FormBase } from '../../components'
// import { ExpressionBuilder } from '../../components/ExpressionBuilder'
import { ExpressionBuilderEntry } from '../../components/ExpressionBuilder'
import { DEFAULT_FIELD_FILTERS, SECTIONS_MAP, useOnSubmitEdit } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PickWithFieldFilters, ValidationRule } from '../../types/generated'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'description',
    'instruction',
    'importance',
    'periodType',
    'leftSideExpression',
    'rightSideExpression',
    'operator',
] as const

export type ValidationRuleFormValues = PickWithFieldFilters<
    ValidationRule,
    typeof fieldFilters
> & { id: string }

export const Component = () => {
    const modelId = useParams().id as string
    const section = SECTIONS_MAP.validationRuleGroup
    const queryFn = useBoundResourceQueryFn()

    const query = {
        resource: 'validationRules',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }

    const validationRulesQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<ValidationRuleFormValues>,
    })
    const initialValues = validationRulesQuery.data

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={initialValues}
            // validate={validate}
            includeAttributes={false}
        >
            <DefaultEditFormContents section={section}>
                <>
                    <ExpressionBuilderEntry
                        fieldName='leftSide.expression'                        
                        title={i18n.t('Edit numerator expression')}
                        editButtonText={i18n.t('Edit this')}
                        validationResource='validationRules/expression/description'
                    />
                </>
            </DefaultEditFormContents>
        </FormBase>
    )
}
