import React, { createContext, useState } from 'react'
import { SectionDescriptor, SectionedFormDescriptor } from './types'

/* Some of the types in this file may look complex.
    However they are here to help type-safety and autocommpletion for consumers.
    
    The only thing consumers need to do is pass the type of the formdescriptor to use the context.
        useSectionedFormDescriptor<typeof FormDescriptor>()
    This helps usage in specific form components.
*/

type AllFieldNames<T extends SectionedFormDescriptor> =
    T['sections'][number]['fields'][number]['name']

/* Helper to avoid returning undefined from a map when we know we have the value from the type.
And conversely - add undefined to TType if we dont have a specifc type for T*/
type EnforceIfInferrable<
    T extends SectionedFormDescriptor,
    TType
> = T extends SectionedFormDescriptor<infer U>
    ? unknown extends U
        ? TType | undefined
        : TType
    : never

function createContextValue<const T extends SectionedFormDescriptor>(
    descriptor: T
) {
    const fieldLabels = Object.fromEntries(
        descriptor.sections.flatMap((section) =>
            section.fields.map((f) => [f.name, f.label] as const)
        )
    ) as Record<AllFieldNames<T>, EnforceIfInferrable<T, string>>

    const sectionMap = Object.fromEntries(
        descriptor.sections.map((s) => [s.name, s])
    ) as Record<
        T['sections'][number]['name'],
        EnforceIfInferrable<T, SectionDescriptor>
    >

    const sections: T['sections'] = descriptor.sections
    return {
        formName: descriptor.name,
        formLabel: descriptor.label,
        sections,
        getSection: (name: T['sections'][number]['name']) => sectionMap[name],
        getFieldLabel: (field: AllFieldNames<T>) => {
            return fieldLabels[field]
        },
    }
}

type SectionFormContextValue<T extends SectionedFormDescriptor> = ReturnType<
    typeof createContextValue<T>
>

export const SectionedFormContext = createContext<ReturnType<
    typeof createContextValue
> | null>(null)

export const SectionedFormDescriptorProvider = <
    T extends SectionedFormDescriptor
>({
    children,
    formDescriptor,
}: {
    formDescriptor: T
    children: React.ReactNode
}) => {
    const [contextValue] = useState(() => createContextValue(formDescriptor))

    return (
        <SectionedFormContext.Provider value={contextValue}>
            {children}
        </SectionedFormContext.Provider>
    )
}

export const useSectionedFormDescriptor = <
    T extends SectionedFormDescriptor
>() => {
    const context = React.useContext(SectionedFormContext)
    if (!context) {
        throw new Error(
            'useSectionedFormDescriptor must be used within a SectionedFormDescriptorProvider'
        )
    }
    return context as SectionFormContextValue<T>
}
