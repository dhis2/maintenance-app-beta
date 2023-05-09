import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ModelSchemas } from "../types/schemaBase";
import type { SchemaPropertyFields } from "./useLoadSchemas";

type Schemas = ModelSchemas<SchemaPropertyFields>;

type EmptyStore = Record<string, never>

export interface SchemasStore {
    schemas: Schemas | EmptyStore;
    setSchemas: (schemas: Schemas) => void;
}

export const useSchemaStore = create<SchemasStore>()(
    devtools((set) => ({
        schemas: {},
        setSchemas: (schemas) => set({ schemas }),
    }))
);

export const useSchemas = () => {
    const schemas = useSchemaStore((state) => state.schemas);

    // cast to Schemas to avoid having to check for empty store
    // in every component that uses this hook
    // schemas should be loaded before rest of the app is rendered
    return schemas as Schemas;
};
