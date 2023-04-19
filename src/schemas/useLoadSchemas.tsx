import { useDataQuery } from "@dhis2/app-runtime";
import { useEffect } from "react";
import { useSchemaStore } from "../schemas/schemaStore";
import {
    PickSchemaProperties,
    SchemaName,
    Schema,
    ModelSchemas,
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
        schemas: PickSchemaProperties<SchemaPropertyFields>[];
    };
}

export const useLoadSchemas = () => {
    const queryResponse = useDataQuery(query);
    const setSchemas = useSchemaStore((state) => state.setSchemas);

    useEffect(() => {
        if (queryResponse.data) {
            const schemaResponse =
                queryResponse.data as unknown as ModelSchemaResponse;
            const schemas = schemaResponse.schemas.schemas;

            const modelSchemas = Object.fromEntries(
                schemas.map((schema) => [schema.name, schema])
            ) as ModelSchemas<SchemaPropertyFields>;

            setSchemas(modelSchemas);
        }
    }, [setSchemas, queryResponse.data]);

    return queryResponse;
};
