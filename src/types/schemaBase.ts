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

// export type SchemaName =
//     | 'access'
//     | 'aggregateDataExchange'
//     | 'analyticsPeriodBoundary'
//     | 'analyticsTableHook'
//     | 'apiToken'
//     | 'attribute'
//     | 'attributeValues'
//     | 'axis'
//     | 'category'
//     | 'categoryCombo'
//     | 'categoryDimension'
//     | 'categoryOption'
//     | 'categoryOptionCombo'
//     | 'categoryOptionGroup'
//     | 'categoryOptionGroupSet'
//     | 'categoryOptionGroupSetDimension'
//     | 'constant'
//     | 'dashboard'
//     | 'dashboardItem'
//     | 'dataApprovalLevel'
//     | 'dataApprovalWorkflow'
//     | 'dataElement'
//     | 'dataElementDimension'
//     | 'dataElementGroup'
//     | 'dataElementGroupSet'
//     | 'dataElementGroupSetDimension'
//     | 'dataElementOperand'
//     | 'dataEntryForm'
//     | 'dataInputPeriods'
//     | 'dataSet'
//     | 'dataSetElement'
//     | 'dataSetNotificationTemplate'
//     | 'document'
//     | 'eventChart'
//     | 'eventRepetition'
//     | 'eventReport'
//     | 'eventVisualization'
//     | 'expression'
//     | 'expressionDimensionItem'
//     | 'externalFileResource'
//     | 'externalMapLayer'
//     | 'icon'
//     | 'indicator'
//     | 'indicatorGroup'
//     | 'indicatorGroupSet'
//     | 'indicatorType'
//     | 'interpretation'
//     | 'interpretationComment'
//     | 'itemConfig'
//     | 'jobConfiguration'
//     | 'legend'
//     | 'legend'
//     | 'legendSet'
//     | 'map'
//     | 'mapView'
//     | 'messageConversation'
//     | 'metadataProposal'
//     | 'metadataVersion'
//     | 'minMaxDataElement'
//     | 'oAuth2Client'
//     | 'objectStyle'
//     | 'option'
//     | 'optionGroup'
//     | 'optionGroupSet'
//     | 'optionSet'
//     | 'organisationUnit'
//     | 'organisationUnitGroup'
//     | 'organisationUnitGroupSet'
//     | 'organisationUnitGroupSetDimension'
//     | 'organisationUnitLevel'
//     | 'outlierAnalysis'
//     | 'predictor'
//     | 'predictorGroup'
//     | 'program'
//     | 'programAttributeDimension'
//     | 'programDataElement'
//     | 'programIndicator'
//     | 'programIndicatorDimension'
//     | 'programIndicatorGroup'
//     | 'programInstance'
//     | 'programNotificationTemplate'
//     | 'programRule'
//     | 'programRuleAction'
//     | 'programRuleVariable'
//     | 'programSection'
//     | 'programStage'
//     | 'programStageDataElement'
//     | 'programStageInstanceFilter'
//     | 'programStageSection'
//     | 'programStageWorkingList'
//     | 'programTrackedEntityAttribute'
//     | 'pushanalysis'
//     | 'relationship'
//     | 'relationshipConstraint'
//     | 'relationshipItem'
//     | 'relationshipType'
//     | 'report'
//     | 'reportingRate'
//     | 'section'
//     | 'seriesKey'
//     | 'sharing'
//     | 'smscommand'
//     | 'sqlView'
//     | 'trackedEntityAttribute'
//     | 'trackedEntityAttributeValue'
//     | 'trackedEntityInstance'
//     | 'trackedEntityType'
//     | 'trackedEntityTypeAttribute'
//     | 'user'
//     | 'userAccess'
//     | 'userCredentialsDto'
//     | 'userGroup'
//     | 'userGroupAccess'
//     | 'userRole'
//     | 'validationResult'
//     | 'validationRule'
//     | 'validationRuleGroup'
//     | 'visualization'

export enum SchemaName {
    Access = 'access',
    AggregateDataExchange = 'aggregateDataExchange',
    AnalyticsPeriodBoundary = 'analyticsPeriodBoundary',
    AnalyticsTableHook = 'analyticsTableHook',
    ApiToken = 'apiToken',
    Attribute = 'attribute',
    AttributeValues = 'attributeValues',
    Axis = 'axis',
    Category = 'category',
    CategoryCombo = 'categoryCombo',
    CategoryDimension = 'categoryDimension',
    CategoryOption = 'categoryOption',
    CategoryOptionCombo = 'categoryOptionCombo',
    CategoryOptionGroup = 'categoryOptionGroup',
    CategoryOptionGroupSet = 'categoryOptionGroupSet',
    CategoryOptionGroupSetDimension = 'categoryOptionGroupSetDimension',
    Constant = 'constant',
    Dashboard = 'dashboard',
    DashboardItem = 'dashboardItem',
    DataApprovalLevel = 'dataApprovalLevel',
    DataApprovalWorkflow = 'dataApprovalWorkflow',
    DataElement = 'dataElement',
    DataElementDimension = 'dataElementDimension',
    DataElementGroup = 'dataElementGroup',
    DataElementGroupSet = 'dataElementGroupSet',
    DataElementGroupSetDimension = 'dataElementGroupSetDimension',
    DataElementOperand = 'dataElementOperand',
    DataEntryForm = 'dataEntryForm',
    DataInputPeriods = 'dataInputPeriods',
    DataSet = 'dataSet',
    DataSetElement = 'dataSetElement',
    DataSetNotificationTemplate = 'dataSetNotificationTemplate',
    Document = 'document',
    EventChart = 'eventChart',
    EventRepetition = 'eventRepetition',
    EventReport = 'eventReport',
    EventVisualization = 'eventVisualization',
    Expression = 'expression',
    ExpressionDimensionItem = 'expressionDimensionItem',
    ExternalFileResource = 'externalFileResource',
    ExternalMapLayer = 'externalMapLayer',
    Icon = 'icon',
    Indicator = 'indicator',
    IndicatorGroup = 'indicatorGroup',
    IndicatorGroupSet = 'indicatorGroupSet',
    IndicatorType = 'indicatorType',
    Interpretation = 'interpretation',
    InterpretationComment = 'interpretationComment',
    ItemConfig = 'itemConfig',
    JobConfiguration = 'jobConfiguration',
    Legend = 'legend',
    LegendSet = 'legendSet',
    Map = 'map',
    MapView = 'mapView',
    MessageConversation = 'messageConversation',
    MetadataProposal = 'metadataProposal',
    MetadataVersion = 'metadataVersion',
    MinMaxDataElement = 'minMaxDataElement',
    OAuth2Client = 'oAuth2Client',
    ObjectStyle = 'objectStyle',
    Option = 'option',
    OptionGroup = 'optionGroup',
    OptionGroupSet = 'optionGroupSet',
    OptionSet = 'optionSet',
    OrganisationUnit = 'organisationUnit',
    OrganisationUnitGroup = 'organisationUnitGroup',
    OrganisationUnitGroupSet = 'organisationUnitGroupSet',
    OrganisationUnitGroupSetDimension = 'organisationUnitGroupSetDimension',
    OrganisationUnitLevel = 'organisationUnitLevel',
    OutlierAnalysis = 'outlierAnalysis',
    Predictor = 'predictor',
    PredictorGroup = 'predictorGroup',
    Program = 'program',
    ProgramAttributeDimension = 'programAttributeDimension',
    ProgramDataElement = 'programDataElement',
    ProgramIndicator = 'programIndicator',
    ProgramIndicatorDimension = 'programIndicatorDimension',
    ProgramIndicatorGroup = 'programIndicatorGroup',
    ProgramInstance = 'programInstance',
    ProgramNotificationTemplate = 'programNotificationTemplate',
    ProgramRule = 'programRule',
    ProgramRuleAction = 'programRuleAction',
    ProgramRuleVariable = 'programRuleVariable',
    ProgramSection = 'programSection',
    ProgramStage = 'programStage',
    ProgramStageDataElement = 'programStageDataElement',
    ProgramStageInstanceFilter = 'programStageInstanceFilter',
    ProgramStageSection = 'programStageSection',
    ProgramStageWorkingList = 'programStageWorkingList',
    ProgramTrackedEntityAttribute = 'programTrackedEntityAttribute',
    PushAnalysis = 'pushanalysis',
    Relationship = 'relationship',
    RelationshipConstraint = 'relationshipConstraint',
    RelationshipItem = 'relationshipItem',
    RelationshipType = 'relationshipType',
    Report = 'report',
    ReportingRate = 'reportingRate',
    Section = 'section',
    SeriesKey = 'seriesKey',
    Sharing = 'sharing',
    SmsCommand = 'smscommand',
    SqlView = 'sqlView',
    TrackedEntityAttribute = 'trackedEntityAttribute',
    TrackedEntityAttributeValue = 'trackedEntityAttributeValue',
    TrackedEntityInstance = 'trackedEntityInstance',
    TrackedEntityType = 'trackedEntityType',
    TrackedEntityTypeAttribute = 'trackedEntityTypeAttribute',
    User = 'user',
    UserAccess = 'userAccess',
    UserCredentialsDto = 'userCredentialsDto',
    UserGroup = 'userGroup',
    UserGroupAccess = 'userGroupAccess',
    UserRole = 'userRole',
    ValidationResult = 'validationResult',
    ValidationRule = 'validationRule',
    ValidationRuleGroup = 'validationRuleGroup',
    Visualization = 'visualization',
}
export type ModelSchemasBase<TSchema extends Partial<SchemaBase> = SchemaBase> =
    Record<SchemaName, TSchema>
