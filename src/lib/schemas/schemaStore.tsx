import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Schemas } from './useLoadSchemas'

export interface SchemasStore {
    schemas: Schemas | undefined
    getSchemas: () => Schemas
    setSchemas: (schemas: Schemas) => void
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
