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

export const useExpressionValidator = (resource: string) => {
    const engine = useDataEngine()
    const [expressionDescription, setExpressionDescription] = useState<
        string | undefined
    >(undefined)
    const [validating, setValidating] = useState(false)

    const memoized = useMemo(
        () =>
            memoize(async (expression?: string) => {
                if (!expression?.trim()) {
                    setExpressionDescription('')
                    return undefined
                }

                setValidating(true)
                try {
                    const result = (await engine.mutate({
                        resource,
                        type: 'create',
                        data: expression as unknown as Record<string, unknown>,
                    })) as unknown as ValidateExpressionResponse

                    if (result.status === 'ERROR') {
                        setExpressionDescription(undefined)
                        return result.message || i18n.t('Invalid expression')
                    }

                    setExpressionDescription(result.description)
                    return undefined
                } catch {
                    setExpressionDescription(undefined)
                    return i18n.t('Could not validate expression')
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

    return [debouncedValidate, expressionDescription, validating] as const
}
