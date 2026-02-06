import { useMemo } from 'react'
import { HEADER_BAR_HEIGHTS } from '../constants'
import { useSystemSettingsStore } from '../systemSettings'

export const useHeaderBarHeight = (): number => {
    const systemSettings = useSystemSettingsStore(
        (state) => state.systemSettings
    )

    const globalShellEnabled = systemSettings?.globalShellEnabled ?? false

    return useMemo(() => {
        return globalShellEnabled
            ? HEADER_BAR_HEIGHTS.NEW_SHELL
            : HEADER_BAR_HEIGHTS.LEGACY
    }, [globalShellEnabled])
}
