import { useMutation } from '@tanstack/react-query'
import { useDataEngine } from '@dhis2/app-runtime'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import i18n from '@dhis2/d2-i18n'

interface ValidateExpressionRequest {
    expression: string
}

export interface ValidateExpressionResponse {
    httpStatus: string
    httpStatusCode: number
    status: 'SUCCESS' | 'ERROR'
    message: string
    description?: string
}

export const useValidateExpressionMutation = () => {
    const engine = useDataEngine()

    return useMutation<ValidateExpressionResponse, unknown, ValidateExpressionRequest>(
        async ({ expression }) => {
            return await engine.mutate({
                resource: 'programIndicators/filter/description',
                type: 'create',
                data: expression as unknown as Record<string, unknown>, 
            })
            
        }
    )
}

export const useValidateExpressionField = () => {
    const { mutateAsync: validateExpression } = useValidateExpressionMutation()
    const [validationError, setValidationError] = useState<string | undefined>(undefined)
    const [isInvalidExpression, setIsInvalidExpression] = useState(false)

    const debouncedValidate = useDebouncedCallback(async (value: string) => {
        if (!value) {
            setValidationError(undefined)
            setIsInvalidExpression(false)
            return
        }

        try {
            const result = await validateExpression({ expression: value })

            if (result.status === 'ERROR') {
                setValidationError(i18n.t('Invalid expression'))
                setIsInvalidExpression(true)
            } else {
                setValidationError(undefined)
                setIsInvalidExpression(false)
            }
        } catch (error) {
            setValidationError(i18n.t('Validation failed'))
            setIsInvalidExpression(true)
        }
    }, 500)

    const handleChange = (value: string) => {
        debouncedValidate(value)
    }

    return {
        validationError,
        isInvalidExpression,
        handleChange,
    }
}

