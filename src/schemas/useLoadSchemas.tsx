import { useDataQuery } from "@dhis2/app-runtime";
import { useEffect } from "react";
import { useSchemaStore } from "../schemas/schemaStore";
import {
    PickSchemaProperties,
} from "../types/schemaBase";

export const schemaPropertyFields = [
    "authorities",
    "displayName",
    "name",
    "plural",
    "translatable",
    "properties",
] as const;

export type SchemaPropertyFields = (typeof schemaPropertyFields)[number];

type Schema = PickSchemaProperties<SchemaPropertyFields>;

const query = {
    schemas: {
        resource: "schemas",
        params: {
            fields: schemaPropertyFields.join(","),
        },
    },
} as const;

interface ModelSchemaResponse {
    schemas: {
        schemas: Schema[];
    };
}

export const useLoadSchemas = () => {
    const queryResponse = useDataQuery<ModelSchemaResponse>(query);
    const setSchemas = useSchemaStore((state) => state.setSchemas);

    useEffect(() => {
        if (queryResponse.data) {
            const schemaResponse = queryResponse.data;
            const schemas = schemaResponse.schemas.schemas;

            const modelSchemas = schemas.map((schema) => ({
                [schema.name]: schema,
            }));
            setSchemas(modelSchemas);
        }
    }, [setSchemas, queryResponse.data]);

    return queryResponse;
};
