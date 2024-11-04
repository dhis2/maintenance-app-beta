import { createStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { uniqueBy } from '../../../lib/utils'
import { SectionedFormSection, SectionFormField } from './types'

type SectionIdentifier = string | SectionedFormSection

export interface FormProps {
    name: string
    sections: SectionedFormSection[]
    sectionFields: Map<string, SectionFormField[]>
}

export interface FormState extends FormProps {
    addSection: (section: SectionedFormSection) => void
    addField: (
        section: string | SectionedFormSection,
        field: SectionFormField
    ) => void
    getFieldsForSection: (section: SectionIdentifier) => SectionFormField[]
    getSectionsForField: (
        field: string | SectionFormField
    ) => SectionedFormSection[] | undefined
}

export type FormStore = ReturnType<typeof createFormStore>

export const createFormStore = (initialProps: Partial<FormState>) =>
    createStore<FormState>()(
        devtools((set, get) => ({
            name: '',
            sections: [],
            sectionFields: new Map(),
            ...initialProps,
            addSection: (section: SectionedFormSection) => {
                const prevSections = get().sections
                set({ sections: prevSections.concat(section) })
            },
            addField: (section, field) => {
                const sectionName = resolveSectionName(section)
                const prevFieldsMap = get().sectionFields
                const newFields = uniqueBy(
                    prevFieldsMap.get(sectionName)?.concat(field) || [field],
                    (field) => field.name
                )

                const sectionFields = new Map(prevFieldsMap).set(
                    sectionName,
                    newFields
                )
                set({ sectionFields })
            },
            getSections: () => get().sections,
            getFieldsForSection: (section: SectionIdentifier) => {
                const sectionName = resolveSectionName(section)
                return get().sectionFields.get(sectionName) || []
            },
            getSectionsForField: (field: string | SectionFormField) => {
                const fieldName = typeof field === 'string' ? field : field.name
                const fieldsBySection = get().sectionFields
                for (const [section, fields] of fieldsBySection.entries()) {
                    if (fields.find((f) => f.name === fieldName)) {
                        return get().sections.filter((s) => s.name === section)
                    }
                }
                return undefined
            },
        }))
    )

const resolveSectionName = (section: SectionIdentifier) => {
    return typeof section === 'string' ? section : section.name
}
