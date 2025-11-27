import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { SchemaName } from '../../types'
import type { ModelSchemas, Schema } from '../useLoadApp'

export interface SchemasStore {
    schemas: ModelSchemas | undefined
    getSchemas: () => ModelSchemas
    setSchemas: (schemas: ModelSchemas) => void
    getSchema: (schemaName: SchemaName) => Schema
}

export const useSchemaStore = create<SchemasStore>()(
    devtools((set, get) => ({
        schemas: undefined,
        getSchemas: () => {
            const schemas = get().schemas
            if (schemas === undefined) {
                throw new Error('Schemas not loaded')
            }

            return schemas
        },
        getSchema(schemaName: SchemaName) {
            return get().getSchemas()[schemaName]
        },
        setSchemas: (schemas) => set({ schemas }),
    }))
)

export const useSetSchemas = () => useSchemaStore((state) => state.setSchemas)

export const useSchemas = () => useSchemaStore((state) => state.getSchemas())

export function useSchema(schemaName: SchemaName): Schema {
    return useSchemaStore((state) => {
        return state.getSchema(schemaName)
    })
}

export function useSchemaOrUndefined(
    schemaName?: SchemaName
): Schema | undefined {
    return useSchemaStore((state) => {
        return schemaName ? state.getSchema(schemaName) : undefined
    })
}
