import React, {
    createContext,
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
    /*
        we need to use a ref for this, because this is changed in an event-handler
        and used downstream in the form submit handler.
        If we used state, the value would not be updated in time for the submit handler.

        Note that we should not read the value of this in render, and should only be used
        in submit event handlers.
    */
    const submitActionRef = useRef<SubmitAction>('saveAndExit')

    const setSubmitAction = useCallback((action: SubmitAction) => {
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
