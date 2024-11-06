export type FieldDescriptor<T = unknown> = {
    label: string
    // keyof T | (string & {}) allows auto-completion for keys of T, while also allowing
    // any other string to be used as a key. This allows fields that not necessarily map to the model-property
    name: keyof T | (string & {})
}

export type SectionDescriptor<T = unknown> = {
    label: string
    name: string
    // keyof T | (string & {}) allows auto-completion for fields, while also allowing
    // any other string to be used as a key
    fields: FieldDescriptor<T>[]
}

export type SectionedFormDescriptor<T = unknown> = {
    name: string
    label: string
    sections: SectionDescriptor<T>[]
}

export type ExtractFieldNames<T> = T extends {
    sections: { fields: { name: infer N }[] }[]
}
    ? N
    : never

export const getLabelForField =
    <T extends SectionedFormDescriptor, F extends ExtractFieldNames<T>>(
        descriptor: T
    ) =>
    (field: F, section?: string) => {
        if (section) {
            const sectionDescriptor = descriptor.sections.find(
                (s) => s.name === section
            )
            if (sectionDescriptor) {
                const fieldDescriptor = sectionDescriptor.fields.find(
                    (f) => f.name === field
                )
                if (fieldDescriptor) {
                    return fieldDescriptor.label
                }
            }
        }
        return descriptor.sections
            .flatMap((s) => s.fields)
            .find((f) => f.name === field)?.label
    }
