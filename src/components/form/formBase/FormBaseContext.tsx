import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useMemo,
    useCallback,
    useRef,
} from 'react'
import type { SubmitAction } from '../../../lib/form/useOnSubmit'

interface FormBaseContextValue {
    submitActionRef: React.MutableRefObject<SubmitAction>
    setSubmitAction: (action: SubmitAction) => void
}

const FormBaseContext = createContext<FormBaseContextValue | undefined>(
    undefined
)

export const useFormBaseContextValue = (): FormBaseContextValue => {
    const submitActionRef = useRef<SubmitAction>('saveAndExit')

    const setSubmitAction = useCallback((action: SubmitAction) => {
        console.log('Setting submit action:', action)
        submitActionRef.current = action
    }, [])

    return useMemo(
        () => ({
            submitActionRef: submitActionRef,
            setSubmitAction,
        }),
        [setSubmitAction]
    )
}

export const FormBaseProvider = ({
    children,
    value,
}: {
    children: ReactNode
    value?: FormBaseContextValue
}) => {
    const contextValue = useFormBaseContextValue()

    return (
        <FormBaseContext.Provider value={value ?? contextValue}>
            {children}
        </FormBaseContext.Provider>
    )
}

export const useFormBase = () => {
    const context = useContext(FormBaseContext)
    if (context === undefined) {
        throw new Error('useFormBase must be used within a FormBaseProvider')
    }
    return context
}
