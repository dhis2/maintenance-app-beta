import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { SchemaName } from '../../types'
import type { ModelSchemas } from '../useLoadApp'

export interface SchemasStore {
    schemas: ModelSchemas | undefined
    getSchemas: () => ModelSchemas
    setSchemas: (schemas: ModelSchemas) => void
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
        setSchemas: (schemas) => set({ schemas }),
    }))
)

export const useSetSchemas = () => useSchemaStore((state) => state.setSchemas)

export const useSchemas = () => useSchemaStore((state) => state.getSchemas())
export const useSchema = (schemaName: SchemaName) =>
    useSchemaStore((state) => state.getSchemas()[schemaName])
