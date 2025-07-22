import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useMutation } from '@tanstack/react-query'
import { useRef, useMemo } from 'react'
import { useDebouncedCallback } from 'use-debounce'

interface ValidateExpressionRequest {
    expression: string
}

interface ValidateExpressionResponse {
    message: string
    description?: string
    status: 'OK' | 'ERROR'
}

export const useValidateExpressionMutation = () => {
    const engine = useDataEngine()

    return useMutation(async ({ expression }: ValidateExpressionRequest) => {
        const response = await engine.mutate({
            resource: 'indicators/expression/description',
            type: 'create',
            data: expression as unknown as Record<string, unknown>,
        })
        return response as unknown as ValidateExpressionResponse
    })
}

export const useValidateIndicatorExpressionValidator = () => {
    const { mutateAsync: validateExpression } = useValidateExpressionMutation()
    const latestValueRef = useRef<string>('')

    const debouncedValidator = useDebouncedCallback(
        async (
            expression: string,
            resolve: (msg: string | undefined) => void
        ) => {
            try {
                const result = await validateExpression({ expression })

                if (latestValueRef.current !== expression) {
                    resolve(undefined)
                    return
                }

                if (result.status === 'ERROR') {
                    resolve(result.message || i18n.t('Invalid expression'))
                } else {
                    resolve(undefined)
                }
            } catch (error) {
                console.error('Validation failed', error)
                resolve(i18n.t('Could not validate expression'))
            }
        },
        500
    )

    return useMemo(() => {
        return async (value?: string): Promise<string | undefined> => {
            const expression = value ?? ''
            latestValueRef.current = expression

            if (!expression.trim()) {
                return undefined
            }

            return new Promise((resolve) => {
                debouncedValidator(expression, resolve)
            })
        }
    }, [debouncedValidator])
}
