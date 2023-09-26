import { useCallback, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export function useDebouncedState<T>({
    initialValue,
    delay = 200,
    onSetDebouncedValue,
    onSetLiveValue,
}: {
    initialValue: T
    delay?: number
    onSetDebouncedValue?: (value: T) => void
    onSetLiveValue?: (value: T) => void
}) {
    const [debouncedValue, _setDebouncedValue] = useState(initialValue)
    const updateDebouncedValue = useCallback(
        (nextValue: T) => {
            _setDebouncedValue(nextValue)

            if (onSetDebouncedValue) {
                onSetDebouncedValue(nextValue)
            }
        },
        [onSetDebouncedValue]
    )
    const setDebouncedValue = useDebouncedCallback<(nextValue: T) => void>(
        updateDebouncedValue,
        delay
    )

    const [liveValue, _setLiveValue] = useState<T>(initialValue)
    const setLiveValue = useCallback(
        (nextValue: T) => {
            _setLiveValue(nextValue)

            if (onSetLiveValue) {
                onSetLiveValue(nextValue)
            }
        },
        [onSetLiveValue]
    )

    const setValue = useCallback(
        (nextValue: T) => {
            setLiveValue(nextValue)
            setDebouncedValue(nextValue)
        },
        [setDebouncedValue, setLiveValue]
    )

    return { liveValue, debouncedValue, setValue }
}
