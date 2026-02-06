import { CSSProperties, useMemo } from 'react'
import { useHeaderBarHeight } from './useHeaderBarHeight'

export const useDrawerOverlayStyles = (): CSSProperties => {
    const headerBarHeight = useHeaderBarHeight()

    return useMemo(
        () => ({
            top: `${headerBarHeight}px`,
            height: `calc(100% - ${headerBarHeight}px)`,
        }),
        [headerBarHeight]
    )
}
