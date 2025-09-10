import { useConfig } from '@dhis2/app-runtime'
import { useCallback } from 'react'
import { Section } from '../constants'

export const useIsSectionFeatureToggle = () => {
    const { apiVersion } = useConfig()
    const isSectionFeatureToggled = useCallback(
        (section: Section) => {
            if (section?.minApiVersion && apiVersion < section.minApiVersion) {
                return false
            }
            if (section?.maxApiVersion && apiVersion > section?.maxApiVersion) {
                return false
            }
            return true
        },
        [apiVersion]
    )
    return isSectionFeatureToggled
}
