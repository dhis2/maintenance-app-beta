import { useDataEngine } from '@dhis2/app-runtime'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'

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
            data: { expression },
        })
        return response as unknown as ValidateExpressionResponse
    })
}

export const useValidateExpressionField = () => {
    const { mutateAsync: validateExpression } = useValidateExpressionMutation()
    const currentValueRef = useRef<string>('')

    const debouncedValidate = useCallback(
        async (value: string) => {
            currentValueRef.current = value

            if (!value) {
                return false
            }

            try {
                const result = await validateExpression({ expression: value })

                // Ignore stale result
                if (currentValueRef.current !== value) {
                    return
                }

                if (result.status === 'ERROR') {
                    return true
                } else {
                    return false
                }
            } catch (error) {
                console.error(error)
                if (currentValueRef.current !== value) {
                    return
                }
                return false
            }
        },
        [validateExpression]
    )

    const handleValidateExpression = (value: string) => {
        return debouncedValidate(value)
    }

    return {
        handleValidateExpression,
    }
}
