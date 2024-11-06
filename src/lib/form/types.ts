import { Field } from '@dhis2/ui'
import { DataSet } from '../../types/generated'

// type AllowAnyString
type FieldDescriptor = {
    label: string
}

type SectionDescriptor<T> = {
    label: string
    // keyof T | (string & {}) allows auto-completion for fields, while also allowing
    // any other string to be used as a key
    fields: Partial<Record<keyof T | (string & {}), FieldDescriptor>>
    // fields: Partial<Record<keyof T | string, FieldDescriptor>>
}

type FormDescriptor<T = unknown> = {
    name: string
    sections: Record<string, SectionDescriptor<T>>
}

const DataSetDescriptor = {
    name: 'DataSet',
    sections: {
        basic: {
            label: 'Basic information',
            fields: {
                name: {
                    label: 'Name',
                },
                code: {
                    label: 'Code',
                },
                someOtherField: {
                    label: 'hello',
                },
                access: {
                    label: 'Access',
                },
                style: {
                    label: 'Style',
                },
                someOtherField: {
                    label: 'Some other field',
                },
            },
        },
    },
} as const satisfies FormDescriptor

type FieldDescriptorAlt<T> = {
    label: string
    // keyof T | (string & {}) allows auto-completion for keys of T, while also allowing
    // any other string to be used as a key. This allows fields that not necessarily map to the model-property
    name: keyof T | (string & {})
}

type SectionDescriptorAlt<T> = {
    label: string
    name: string
    // keyof T | (string & {}) allows auto-completion for fields, while also allowing
    // any other string to be used as a key
    fields: FieldDescriptorAlt<T>[]
}

type DescriptorAlt<T = unknown> = {
    name: string
    label: string
    sections: SectionDescriptorAlt<T>[]
}

const DataSetDescriptorAlt = {
    name: 'DataSet',
    label: 'Data Set',
    sections: [
        {
            name: 'basic',
            label: 'Basic information',
            fields: [
                {
                    name: 'name',
                    label: 'Name',
                },
                {
                    name: 'code',
                    label: 'Code',
                },
                {
                    name: 'sharing',
                    label: 'Access',
                },
                {
                    name: 'style',
                    label: 'Style',
                },
                {
                    name: 'someOtherField',
                    label: 'Some other field',
                },
            ],
        },
    ],
} satisfies DescriptorAlt<DataSet>

type ExtractFieldNames<T> = T extends {
    sections: { fields: { name: infer N }[] }[]
}
    ? N
    : never

const getLabelForField = <
    T extends DescriptorAlt,
    F extends ExtractFieldNames<T>
>(
    field: F,
    descriptor: T,
    section?: string
) => {
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
const label = getLabelForField('style', DataSetDescriptorAlt)

const nameLabel = DataSetDescriptor.sections.basic.fields.name.label
