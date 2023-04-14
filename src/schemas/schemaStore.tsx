import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ModelSchemas } from "../types/schemaBase";
import type { SchemaPropertyFields } from "./useLoadSchemas";

export interface SchemasStore {
    schemas: ModelSchemas<SchemaPropertyFields>;
    setSchemas: (schemas: ModelSchemas<SchemaPropertyFields>) => void;
}

export const useSchemaStore = create<SchemasStore>()(
    devtools((set) => ({
        schemas: {},
        setSchemas: (schemas) => set({ schemas }),
    }))
);

export const useSchemas = () => {
    const schemas = useSchemaStore((state) => state.schemas);
    return schemas;
};
