import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import memoize from 'lodash/memoize'
import { useCallback, useMemo, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

interface ValidateExpressionResponse {
    message: string
    description?: string
    status: 'OK' | 'ERROR'
}

type ValidationResult = {
    error?: string
    expressionDescription?: string
}
export const useExpressionValidator = (resource: string) => {
    const engine = useDataEngine()
    const [validating, setValidating] = useState(false)

    const memoized = useMemo(
        () =>
            memoize(async (expression?: string) => {
                if (!expression?.trim()) {
                    return {
                        error: undefined,
                        expressionDescription: '',
                    } as ValidationResult
                }

                setValidating(true)
                try {
                    const result = await (engine.mutate({
                        resource,
                        type: 'create',
                        data: expression as unknown as Record<string, unknown>,
                    }) as unknown as Promise<ValidateExpressionResponse>)

                    if (result.status === 'ERROR') {
                        return {
                            error:
                                result.message || i18n.t('Invalid expression'),
                            expressionDescription: undefined,
                        } as ValidationResult
                    }
                    return {
                        error: undefined,
                        expressionDescription: result.description,
                    } as ValidationResult
                } catch {
                    return {
                        error: i18n.t('Could not validate expression'),
                        expressionDescription: undefined,
                    } as ValidationResult
                } finally {
                    setValidating(false)
                }
            }),
        [resource, engine]
    )

    const validate = useCallback(
        (value?: string) => memoized(value),
        [memoized]
    )

    const debouncedValidate = useDebouncedCallback(validate, 200, {
        leading: true,
    })

    return [debouncedValidate, validating] as const
}
