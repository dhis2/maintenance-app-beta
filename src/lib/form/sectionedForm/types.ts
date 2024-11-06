export type FieldDescriptor<T = unknown> = {
    label: string
    // keyof T | (string & {}) allows auto-completion for keys of T, while also allowing
    // any other string to be used as a key. This allows fields that not necessarily map to the model-property
    name: keyof T | (string & {})
}

export type SectionDescriptor<T> = {
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
