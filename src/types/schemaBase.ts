export type SchemaPropertyType =
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

export interface Schema {
    authorities: SchemaAuthorities;
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

export type PickSchemaProperties<T extends keyof Schema> = Pick<Schema, T>;

export interface SchemaFieldProperties {
    name: string;
    fieldName?: string;
    propertyType: SchemaPropertyType | "COLLECTION";
    itemPropertyType?: SchemaPropertyType;
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

export type SchemaName =
    | "access"
    | "aggregateDataExchange"
    | "analyticsPeriodBoundary"
    | "analyticsTableHook"
    | "apiToken"
    | "attribute"
    | "attributeValues"
    | "axis"
    | "category"
    | "categoryCombo"
    | "categoryDimension"
    | "categoryOption"
    | "categoryOptionCombo"
    | "categoryOptionGroup"
    | "categoryOptionGroupSet"
    | "categoryOptionGroupSetDimension"
    | "constant"
    | "dashboard"
    | "dashboardItem"
    | "dataApprovalLevel"
    | "dataApprovalWorkflow"
    | "dataElement"
    | "dataElementDimension"
    | "dataElementGroup"
    | "dataElementGroupSet"
    | "dataElementGroupSetDimension"
    | "dataElementOperand"
    | "dataEntryForm"
    | "dataInputPeriods"
    | "dataSet"
    | "dataSetElement"
    | "dataSetNotificationTemplate"
    | "document"
    | "eventChart"
    | "eventRepetition"
    | "eventReport"
    | "eventVisualization"
    | "expression"
    | "expressionDimensionItem"
    | "externalFileResource"
    | "externalMapLayer"
    | "icon"
    | "indicator"
    | "indicatorGroup"
    | "indicatorGroupSet"
    | "indicatorType"
    | "interpretation"
    | "interpretationComment"
    | "itemConfig"
    | "jobConfiguration"
    | "legend"
    | "legend"
    | "legendSet"
    | "map"
    | "mapView"
    | "messageConversation"
    | "metadataProposal"
    | "metadataVersion"
    | "minMaxDataElement"
    | "oAuth2Client"
    | "objectStyle"
    | "option"
    | "optionGroup"
    | "optionGroupSet"
    | "optionSet"
    | "organisationUnit"
    | "organisationUnitGroup"
    | "organisationUnitGroupSet"
    | "organisationUnitGroupSetDimension"
    | "organisationUnitLevel"
    | "outlierAnalysis"
    | "predictor"
    | "predictorGroup"
    | "program"
    | "programAttributeDimension"
    | "programDataElement"
    | "programIndicator"
    | "programIndicatorDimension"
    | "programIndicatorGroup"
    | "programInstance"
    | "programNotificationTemplate"
    | "programRule"
    | "programRuleAction"
    | "programRuleVariable"
    | "programSection"
    | "programStage"
    | "programStageDataElement"
    | "programStageInstanceFilter"
    | "programStageSection"
    | "programStageWorkingList"
    | "programTrackedEntityAttribute"
    | "pushanalysis"
    | "relationship"
    | "relationshipConstraint"
    | "relationshipItem"
    | "relationshipType"
    | "report"
    | "reportingRate"
    | "section"
    | "seriesKey"
    | "sharing"
    | "smscommand"
    | "sqlView"
    | "trackedEntityAttribute"
    | "trackedEntityAttributeValue"
    | "trackedEntityInstance"
    | "trackedEntityType"
    | "trackedEntityTypeAttribute"
    | "user"
    | "userAccess"
    | "userCredentialsDto"
    | "userGroup"
    | "userGroupAccess"
    | "userRole"
    | "validationResult"
    | "validationRule"
    | "validationRuleGroup"
    | "visualization";

export type ModelSchemas<TSchemaFields extends keyof Schema = keyof Schema> = {
    [key in SchemaName]: PickSchemaProperties<TSchemaFields>;
};

// export type ModelSchemas<
//     SchemaFields extends keyof SchemaProperties = keyof SchemaProperties
// > = { [key: string]: Pick<SchemaProperties, SchemaFields> };
