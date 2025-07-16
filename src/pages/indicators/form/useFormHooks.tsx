import { useDataEngine } from '@dhis2/app-runtime'
import { useMutation } from '@tanstack/react-query'
import { useRef, useCallback } from 'react'

interface ValidateExpressionRequest {
    expression: string
}

interface ValidateExpressionResponse {
    description?: string
    status: 'OK' | 'ERROR'
}

export const useValidateIndicatorExpressionMutation = () => {
    const engine = useDataEngine()

    return useMutation(async ({ expression }: ValidateExpressionRequest) => {
        const response = await engine.mutate({
            resource: 'indicators/expression/description',
            type: 'create',
            data: { expression },
        })
        return response as unknown as ValidateExpressionResponse
    })
}

export const useValidateIndicatorExpressionField = () => {
    const { mutateAsync: validateExpression } =
        useValidateIndicatorExpressionMutation()
    const currentValueRef = useRef<string>('')

    const debouncedValidate = useCallback(
        async (value: string) => {
            currentValueRef.current = value

            if (!value) {
                return false
            }

            try {
                const result = await validateExpression({ expression: value })

                if (currentValueRef.current !== value) {
                    return
                }

                return result.status === 'ERROR'
            } catch (err) {
                console.error(err)
                if (currentValueRef.current !== value) {
                    return
                }
                return true
            }
        },
        [validateExpression]
    )

    const handleValidateExpression = (value: string) => {
        return debouncedValidate(value)
    }

    return { handleValidateExpression }
}
