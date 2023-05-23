import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Schemas } from './useLoadSchemas'

type EmptyStore = Record<string, never>

const isEmptyStore = (store: Record<string, unknown>): store is EmptyStore =>
    Object.keys(store).length === 0

export interface SchemasStore {
    schemas: Schemas | EmptyStore
    setSchemas: (schemas: Schemas) => void
}

export const useSchemaStore = create<SchemasStore>()(
    devtools((set) => ({
        schemas: {},
        setSchemas: (schemas) => set({ schemas }),
    }))
)

export const useSchemas = () => {
    const schemas = useSchemaStore((state) => state.schemas)

    if (isEmptyStore(schemas)) {
        // schemas should be loaded before rest of the app (and this is used)
        throw new Error('Schemas not loaded')
    }

    return schemas
}
