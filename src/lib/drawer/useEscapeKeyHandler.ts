import { useEffect } from 'react'

export const useEscapeKeyHandler = (
    onClose: () => void,
    isEnabled: boolean = true
): void => {
    useEffect(() => {
        if (!isEnabled) {
            return
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [onClose, isEnabled])
}
