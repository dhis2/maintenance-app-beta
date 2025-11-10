import { useConfig } from '@dhis2/app-runtime'
import { useMemo } from 'react'
import { hasAPISupportForFeature } from './support'

export const useFeatureAvailable = (featureName: string): boolean => {
    const { serverVersion: { minor: minorVersion } = { minor: 0 } } =
        useConfig()
    return useMemo(
        () => hasAPISupportForFeature(minorVersion, featureName),
        [minorVersion, featureName]
    )
}
