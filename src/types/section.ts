import { SchemaName } from './schemaBase'

export interface SectionBase {
    name: string
    namePlural: string
    titlePlural: string
    title: string
    parentSectionKey: string
}

// SchemaSection is a section that can be mapped directly to a schema by the name
export interface SchemaSection extends SectionBase {
    name: SchemaName
}

export type Section = SchemaSection | SectionBase

export type SchemaSectionMap = {
    [key in SchemaName]?: SchemaSection
}

export type SectionMap = Record<string, Section | SchemaSection>
