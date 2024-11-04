import { useContext } from 'react'
import { useStore } from 'zustand'
import { FormState } from './formStore'
import { SectionedFormContext } from './SectionedFormContext'

export function useSectionedFormState(): FormState
export function useSectionedFormState<T>(selector: (state: FormState) => T): T
export function useSectionedFormState<T>(selector?: (state: FormState) => T) {
    const formStore = useContext(SectionedFormContext)
    if (!formStore) {
        throw new Error(
            'useFormState must be used within a SectionedFormProvider'
        )
    }
    return useStore(formStore, selector!)
}
