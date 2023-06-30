import { SchemaAuthorities, SchemaName } from './schemaBase'

export interface SectionBase {
    name: string
    namePlural: string
    titlePlural: string
    title: string
}

// SchemaSection is a section that can be mapped directly to a schema by the name
// export interface SchemaSection extends SectionBase {
//     name: SchemaName
// }

export type SchemaSection = SectionBase & {
    name: SchemaName
    parentSectionKey: string
}

export type NonSchemaSection = SectionBase & {
    authorities?: SchemaAuthorities
    parentSectionKey: string
}

// export interface NonSchemaSection extends SectionBase {
//     authorities?: SchemaAuthorities
// }

export type OverviewSection = SectionBase & {
    componentName: string
}

// export interface OverviewSectionI extends OverviewSectionBase {
//     test?: string
// }

// export type OverviewSection = Omit<SectionBase, 'parentSectionKey'> // OverviewSectionI

export type Section = SchemaSection | NonSchemaSection | OverviewSection

export type SchemaSectionMap = {
    [key in SchemaName]?: SchemaSection
}

export type OverviewSectionMap = Record<string, OverviewSection>

export type SectionMap = Record<string, SchemaSection | NonSchemaSection>
