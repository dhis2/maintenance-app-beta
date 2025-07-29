import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import memoize from 'lodash/memoize'
import { useCallback, useMemo } from 'react'
import { useDebouncedCallback } from 'use-debounce'

interface ValidateExpressionResponse {
    message: string
    description?: string
    status: 'OK' | 'ERROR'
}

export const useExpressionValidator = (resource: string) => {
    const engine = useDataEngine()

    const memoized = useMemo(
        () =>
            memoize(async (expression?: string) => {
                if (!expression?.trim()) {
                    return undefined
                }

                try {
                    const result = (await engine.mutate({
                        resource,
                        type: 'create',
                        data: expression as unknown as Record<string, unknown>,
                    })) as unknown as ValidateExpressionResponse

                    return result.status === 'ERROR'
                        ? result.message || i18n.t('Invalid expression')
                        : undefined
                } catch {
                    return i18n.t('Could not validate expression')
                }
            }),
        [resource, engine]
    )

    const validate = useCallback(
        (value?: string) => memoized(value),
        [memoized]
    )

    return useDebouncedCallback(validate, 200, { leading: true })
}
