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
    const [description, setDescription] = useState<string | null>(null)
    const [validating, setValidating] = useState(false)

    const memoized = useMemo(
        () =>
            memoize(async (expression?: string) => {
                if (!expression?.trim()) {
                    setDescription(null)
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
                        setDescription(null)
                        return result.message || i18n.t('Invalid expression')
                    }

                    setDescription(result.description ?? null)
                    return undefined
                } catch {
                    setDescription(null)
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

    return [debouncedValidate, description, validating] as const
}
