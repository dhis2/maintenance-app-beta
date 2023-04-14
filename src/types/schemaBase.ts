import { FullModelSchema } from './schemaBase';
export type SchemaTypes =
    | "REFERENCE"
    | "BOOLEAN"
    | "TEXT"
    | "DATE"
    | "IDENTIFIER"
    | "URL"
    | "CONSTANT"
    | "INTEGER"
    | "COMPLEX"
    | "PHONENUMBER"
    | "EMAIL"
    | "COLOR"
    | "PASSWORD"
    | "NUMBER"
    | "GEOLOCATION";

export interface SchemaProperties {
    authorities: SchemaAuthorities[];
    klass: string;
    name: string;
    plural: string;
    singular: string;
    metadata: boolean;
    displayName: string;
    shareable: boolean;
    relativeApiEndpoint?: string;
    collectionName: string;
    nameableObject: boolean;
    translatable: boolean;
    identifiableObject: boolean;
    dataShareable: boolean;
    persisted: boolean;
    embeddedObject: boolean;
    properties: SchemaFieldProperties[];
}

export interface SchemaFieldProperties {
    name: string;
    fieldName?: string;
    propertyType: SchemaTypes | "COLLECTION";
    itemPropertyType?: SchemaTypes;
    klass: string;
    itemKlass?: string;
}

export type Id = string;

export interface ModelReference {
    id: Id;
}

// https://docs.dhis2.org/javadoc/2.39/org/hisp/dhis/security/AuthorityType.html
enum SchemaAuthorityType {
    CREATE = "CREATE",
    CREATE_PRIVATE = "CREATE_PRIVATE",
    CREATE_PUBLIC = "CREATE_PUBLIC",
    DATA_CREATE = "DATA_CREATE",
    DATA_READ = "DATA_READ",
    DELETE = "DELETE",
    EXTERNALIZE = "EXTERNALIZE",
    READ = "READ",
    UPDATE = "UPDATE",
}
export interface SchemaAuthority {
    type: SchemaAuthorityType;
    authorities: string[];
}
export type SchemaAuthorities = SchemaAuthority[];

export type FullModelSchemas = {
    [key: string]: SchemaProperties;
};

export type ModelSchemas<
    TSchemaFields extends keyof SchemaProperties = keyof SchemaProperties
> = {
    [K in keyof FullModelSchema]: Pick<FullModelSchema[K], TSchemaFields>;
};

// export type ModelSchemas<
//     SchemaFields extends keyof SchemaProperties = keyof SchemaProperties
// > = { [key: string]: Pick<SchemaProperties, SchemaFields> };

