// called "SchemaBase" because the actual Schema we use
// is a subset of this type (due to field-filtering)
export interface SchemaBase {
    authorities: SchemaAuthorities
    klass: string
    name: SchemaName
    plural: string
    singular: string
    metadata: boolean
    displayName: string
    shareable: boolean
    relativeApiEndpoint?: string
    collectionName: string
    nameableObject: boolean
    translatable: boolean
    identifiableObject: boolean
    dataShareable: boolean
    persisted: boolean
    embeddedObject: boolean
    properties: SchemaFieldProperty[]
}

export type PickSchemaProperties<T extends keyof SchemaBase> = Pick<
    SchemaBase,
    T
>

export interface SchemaFieldProperty {
    name: string
    fieldName?: string
    propertyType: SchemaFieldPropertyType | 'COLLECTION'
    itemPropertyType?: SchemaFieldPropertyType
    klass: string
    itemKlass?: string
    unique: boolean
    required: boolean
    length?: number
    persisted: boolean
    collectionName?: string
    collection: boolean
    attribute: boolean
    simple: boolean
    constants?: string[]
    embeddedObject: boolean
    identifiableObject: boolean
    relativeApiEndpoint?: string
    translatable: boolean
    owner: boolean
    readable: boolean
    writable: boolean
}

enum SchemaFieldPropertyType {
    REFERENCE = 'REFERENCE',
    BOOLEAN = 'BOOLEAN',
    TEXT = 'TEXT',
    DATE = 'DATE',
    IDENTIFIER = 'IDENTIFIER',
    URL = 'URL',
    CONSTANT = 'CONSTANT',
    INTEGER = 'INTEGER',
    COMPLEX = 'COMPLEX',
    PHONENUMBER = 'PHONENUMBER',
    EMAIL = 'EMAIL',
    COLOR = 'COLOR',
    PASSWORD = 'PASSWORD',
    NUMBER = 'NUMBER',
    GEOLOCATION = 'GEOLOCATION',
}

// https://docs.dhis2.org/javadoc/2.39/org/hisp/dhis/security/AuthorityType.html
export enum SchemaAuthorityType {
    CREATE = 'CREATE',
    CREATE_PRIVATE = 'CREATE_PRIVATE',
    CREATE_PUBLIC = 'CREATE_PUBLIC',
    DATA_CREATE = 'DATA_CREATE',
    DATA_READ = 'DATA_READ',
    DELETE = 'DELETE',
    EXTERNALIZE = 'EXTERNALIZE',
    READ = 'READ',
    UPDATE = 'UPDATE',
}
export interface SchemaAuthority {
    type: SchemaAuthorityType
    authorities: string[]
}

export type SchemaAuthorities = SchemaAuthority[]

export type SchemaName =
    | 'access'
    | 'aggregateDataExchange'
    | 'analyticsPeriodBoundary'
    | 'analyticsTableHook'
    | 'apiToken'
    | 'attribute'
    | 'attributeValues'
    | 'axis'
    | 'category'
    | 'categoryCombo'
    | 'categoryDimension'
    | 'categoryOption'
    | 'categoryOptionCombo'
    | 'categoryOptionGroup'
    | 'categoryOptionGroupSet'
    | 'categoryOptionGroupSetDimension'
    | 'constant'
    | 'dashboard'
    | 'dashboardItem'
    | 'dataApprovalLevel'
    | 'dataApprovalWorkflow'
    | 'dataElement'
    | 'dataElementDimension'
    | 'dataElementGroup'
    | 'dataElementGroupSet'
    | 'dataElementGroupSetDimension'
    | 'dataElementOperand'
    | 'dataEntryForm'
    | 'dataInputPeriods'
    | 'dataSet'
    | 'dataSetElement'
    | 'dataSetNotificationTemplate'
    | 'document'
    | 'eventChart'
    | 'eventRepetition'
    | 'eventReport'
    | 'eventVisualization'
    | 'expression'
    | 'expressionDimensionItem'
    | 'externalFileResource'
    | 'externalMapLayer'
    | 'icon'
    | 'indicator'
    | 'indicatorGroup'
    | 'indicatorGroupSet'
    | 'indicatorType'
    | 'interpretation'
    | 'interpretationComment'
    | 'itemConfig'
    | 'jobConfiguration'
    | 'legend'
    | 'legend'
    | 'legendSet'
    | 'map'
    | 'mapView'
    | 'messageConversation'
    | 'metadataProposal'
    | 'metadataVersion'
    | 'minMaxDataElement'
    | 'oAuth2Client'
    | 'objectStyle'
    | 'option'
    | 'optionGroup'
    | 'optionGroupSet'
    | 'optionSet'
    | 'organisationUnit'
    | 'organisationUnitGroup'
    | 'organisationUnitGroupSet'
    | 'organisationUnitGroupSetDimension'
    | 'organisationUnitLevel'
    | 'outlierAnalysis'
    | 'predictor'
    | 'predictorGroup'
    | 'program'
    | 'programAttributeDimension'
    | 'programDataElement'
    | 'programIndicator'
    | 'programIndicatorDimension'
    | 'programIndicatorGroup'
    | 'programInstance'
    | 'programNotificationTemplate'
    | 'programRule'
    | 'programRuleAction'
    | 'programRuleVariable'
    | 'programSection'
    | 'programStage'
    | 'programStageDataElement'
    | 'programStageInstanceFilter'
    | 'programStageSection'
    | 'programStageWorkingList'
    | 'programTrackedEntityAttribute'
    | 'pushanalysis'
    | 'relationship'
    | 'relationshipConstraint'
    | 'relationshipItem'
    | 'relationshipType'
    | 'report'
    | 'reportingRate'
    | 'section'
    | 'seriesKey'
    | 'sharing'
    | 'smscommand'
    | 'sqlView'
    | 'trackedEntityAttribute'
    | 'trackedEntityAttributeValue'
    | 'trackedEntityInstance'
    | 'trackedEntityType'
    | 'trackedEntityTypeAttribute'
    | 'user'
    | 'userAccess'
    | 'userCredentialsDto'
    | 'userGroup'
    | 'userGroupAccess'
    | 'userRole'
    | 'validationResult'
    | 'validationRule'
    | 'validationRuleGroup'
    | 'visualization'

export type BaseModelSchemas<
    TSchemaFields extends keyof SchemaBase = keyof SchemaBase
> = Record<SchemaName, PickSchemaProperties<TSchemaFields>>

// export type ModelSchemas<
//     SchemaFields extends keyof SchemaProperties = keyof SchemaProperties
// > = { [key: string]: Pick<SchemaProperties, SchemaFields> };
