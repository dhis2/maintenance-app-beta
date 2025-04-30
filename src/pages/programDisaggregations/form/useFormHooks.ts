import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useState, useRef } from 'react'

interface ValidateExpressionRequest {
    expression: string
}

export interface ValidateExpressionResponse {
    httpStatus: string
    httpStatusCode: number
    status: 'OK' | 'ERROR'
    message: string
    description?: string
}

export const useValidateExpressionMutation = () => {
    const engine = useDataEngine()

    return useMutation(async ({ expression }: ValidateExpressionRequest) => {
        const response = await engine.mutate({
            resource: 'programIndicators/filter/description',
            type: 'create',
            data: expression as unknown as Record<string, unknown>,
        })
        return response as unknown as ValidateExpressionResponse
    })
}

export const useValidateExpressionField = () => {
    const { mutateAsync: validateExpression } = useValidateExpressionMutation()
    const [validationError, setValidationError] = useState<string | undefined>(
        undefined
    )
    const [isInvalidExpression, setIsInvalidExpression] = useState(false)
    const currentValueRef = useRef<string>('')

    const debouncedValidate = useCallback(
        async (value: string) => {
            currentValueRef.current = value

            if (!value) {
                setValidationError(undefined)
                setIsInvalidExpression(false)
                return false
            }

            try {
                const result = await validateExpression({ expression: value })

                // Ignore stale result
                if (currentValueRef.current !== value) {
                    return
                }

                if (result.status === 'ERROR') {
                    setValidationError(i18n.t('Invalid expression'))
                    setIsInvalidExpression(true)
                    return true
                } else {
                    setValidationError(undefined)
                    setIsInvalidExpression(false)
                    return false
                }
            } catch (error) {
                if (currentValueRef.current !== value) {
                    return
                }

                setValidationError(i18n.t('Validation failed'))
                setIsInvalidExpression(true)
            }
        },
        [validateExpression]
    )

    const handleChange = (value: string) => {
        return debouncedValidate(value)
    }

    return {
        validationError,
        isInvalidExpression,
        handleChange,
    }
}
