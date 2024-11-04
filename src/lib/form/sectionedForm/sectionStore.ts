import { create, createStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { SectionedFormSection, SectionFormField } from './types'

export interface SectionProps {
    section: SectionedFormSection
}

export interface SectionState extends SectionProps {
    setSection: (section: SectionedFormSection) => void
    getSection: () => SectionedFormSection
}
export type SectionStore = ReturnType<typeof createSectionStore>

export const createSectionStore = (initialProps: SectionProps) =>
    createStore<SectionState>()(
        devtools((set, get) => ({
            ...initialProps,
            setSection: (section: SectionedFormSection) => {
                set({ section })
            },
            getSection: () => {
                return get().section
            },
        }))
    )
