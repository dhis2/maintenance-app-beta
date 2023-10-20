// called "SchemaBase" because the actual Schema we use
// is a subset of this type (due to field-filtering)
export interface SchemaBase {
    authorities: SchemaAuthorities
    klass: string
    name: string
    plural: string
    singular: SchemaName
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
    properties: Record<string, SchemaFieldProperty>
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

export enum SchemaFieldPropertyType {
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
    authorities: string[] | readonly string[]
}

export type SchemaAuthorities = readonly SchemaAuthority[]

export enum SchemaName {
    access = 'access',
    aggregateDataExchange = 'aggregateDataExchange',
    analyticsPeriodBoundary = 'analyticsPeriodBoundary',
    analyticsTableHook = 'analyticsTableHook',
    apiToken = 'apiToken',
    attribute = 'attribute',
    attributeValues = 'attributeValues',
    axis = 'axis',
    category = 'category',
    categoryCombo = 'categoryCombo',
    categoryDimension = 'categoryDimension',
    categoryOption = 'categoryOption',
    categoryOptionCombo = 'categoryOptionCombo',
    categoryOptionGroup = 'categoryOptionGroup',
    categoryOptionGroupSet = 'categoryOptionGroupSet',
    categoryOptionGroupSetDimension = 'categoryOptionGroupSetDimension',
    constant = 'constant',
    dashboard = 'dashboard',
    dashboardItem = 'dashboardItem',
    dataApprovalLevel = 'dataApprovalLevel',
    dataApprovalWorkflow = 'dataApprovalWorkflow',
    dataElement = 'dataElement',
    dataElementDimension = 'dataElementDimension',
    dataElementGroup = 'dataElementGroup',
    dataElementGroupSet = 'dataElementGroupSet',
    dataElementGroupSetDimension = 'dataElementGroupSetDimension',
    dataElementOperand = 'dataElementOperand',
    dataEntryForm = 'dataEntryForm',
    dataInputPeriods = 'dataInputPeriods',
    dataSet = 'dataSet',
    dataSetElement = 'dataSetElement',
    dataSetNotificationTemplate = 'dataSetNotificationTemplate',
    document = 'document',
    eventChart = 'eventChart',
    eventRepetition = 'eventRepetition',
    eventReport = 'eventReport',
    eventVisualization = 'eventVisualization',
    expression = 'expression',
    expressionDimensionItem = 'expressionDimensionItem',
    externalFileResource = 'externalFileResource',
    externalMapLayer = 'externalMapLayer',
    icon = 'icon',
    indicator = 'indicator',
    indicatorGroup = 'indicatorGroup',
    indicatorGroupSet = 'indicatorGroupSet',
    indicatorType = 'indicatorType',
    interpretation = 'interpretation',
    interpretationComment = 'interpretationComment',
    itemConfig = 'itemConfig',
    jobConfiguration = 'jobConfiguration',
    legend = 'legend',
    legendSet = 'legendSet',
    map = 'map',
    mapView = 'mapView',
    messageConversation = 'messageConversation',
    metadataProposal = 'metadataProposal',
    metadataVersion = 'metadataVersion',
    minMaxDataElement = 'minMaxDataElement',
    oAuth2Client = 'oAuth2Client',
    objectStyle = 'objectStyle',
    option = 'option',
    optionGroup = 'optionGroup',
    optionGroupSet = 'optionGroupSet',
    optionSet = 'optionSet',
    organisationUnit = 'organisationUnit',
    organisationUnitGroup = 'organisationUnitGroup',
    organisationUnitGroupSet = 'organisationUnitGroupSet',
    organisationUnitGroupSetDimension = 'organisationUnitGroupSetDimension',
    organisationUnitLevel = 'organisationUnitLevel',
    outlierAnalysis = 'outlierAnalysis',
    predictor = 'predictor',
    predictorGroup = 'predictorGroup',
    program = 'program',
    programAttributeDimension = 'programAttributeDimension',
    programDataElement = 'programDataElement',
    programIndicator = 'programIndicator',
    programIndicatorDimension = 'programIndicatorDimension',
    programIndicatorGroup = 'programIndicatorGroup',
    programInstance = 'programInstance',
    programNotificationTemplate = 'programNotificationTemplate',
    programRule = 'programRule',
    programRuleAction = 'programRuleAction',
    programRuleVariable = 'programRuleVariable',
    programSection = 'programSection',
    programStage = 'programStage',
    programStageDataElement = 'programStageDataElement',
    programStageInstanceFilter = 'programStageInstanceFilter',
    programStageSection = 'programStageSection',
    programStageWorkingList = 'programStageWorkingList',
    programTrackedEntityAttribute = 'programTrackedEntityAttribute',
    pushAnalysis = 'pushAnalysis',
    relationship = 'relationship',
    relationshipConstraint = 'relationshipConstraint',
    relationshipItem = 'relationshipItem',
    relationshipType = 'relationshipType',
    report = 'report',
    reportingRate = 'reportingRate',
    section = 'section',
    seriesKey = 'seriesKey',
    sharing = 'sharing',
    smsCommand = 'smscommand',
    sqlView = 'sqlView',
    trackedEntityAttribute = 'trackedEntityAttribute',
    trackedEntityAttributeValue = 'trackedEntityAttributeValue',
    trackedEntityInstance = 'trackedEntityInstance',
    trackedEntityType = 'trackedEntityType',
    trackedEntityTypeAttribute = 'trackedEntityTypeAttribute',
    user = 'user',
    userAccess = 'userAccess',
    userCredentialsDto = 'userCredentialsDto',
    userGroup = 'userGroup',
    userGroupAccess = 'userGroupAccess',
    userRole = 'userRole',
    validationNotificationTemplate = 'validationNotificationTemplate',
    validationResult = 'validationResult',
    validationRule = 'validationRule',
    validationRuleGroup = 'validationRuleGroup',
    visualization = 'visualization',
}

export type ModelSchemasBase<TSchema extends Partial<SchemaBase> = SchemaBase> =
    Record<SchemaName, TSchema>
