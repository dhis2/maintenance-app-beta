import { CSSProperties, useMemo } from 'react'
import { HEADER_BAR_HEIGHTS } from '../constants'
import { useSystemSettingsStore } from '../systemSettings'

export const useDrawerOverlayStyles = (): CSSProperties => {
    const globalShellEnabled =
        useSystemSettingsStore(
            (state) => state.systemSettings?.globalShellEnabled
        ) ?? false

    return useMemo(() => {
        if (globalShellEnabled) {
            return { top: 0, height: '100%' }
        }
        const headerBarHeight = HEADER_BAR_HEIGHTS.LEGACY
        return {
            top: `${headerBarHeight}px`,
            height: `calc(100% - ${headerBarHeight}px)`,
        }
    }, [globalShellEnabled])
}
