import { useConfig } from '@dhis2/app-runtime'
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
    const { baseUrl } = useConfig()
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
                    // Use fetch directly to send the expression as raw text body
                    // The data engine JSON-stringifies the data, but the API expects raw text
                    const response = await fetch(`${baseUrl}/api/${resource}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain',
                        },
                        body: expression,
                        credentials: 'include',
                    })

                    const result =
                        (await response.json()) as ValidateExpressionResponse

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
        [resource, baseUrl]
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
