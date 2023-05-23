import type {
    Access,
    AccessWithData,
    ModelBase,
    ModelReference,
    Geometry,
    ReportingParams,
    ProgramOwner,
    Translation,
} from './modelBase'

export interface AggregateDataExchange extends ModelBase {
    source: unknown
    target: unknown
}

export interface AnalyticsPeriodBoundary extends ModelBase {
    analyticsPeriodBoundaryType: AnalyticsPeriodBoundaryAnalyticsPeriodBoundaryType
    boundaryTarget: string
    offsetPeriodType: string
    offsetPeriods: number
}

export interface AnalyticsTableHook extends ModelBase {
    analyticsTableType: AnalyticsTableHookAnalyticsTableType
    phase: AnalyticsTableHookPhase
    resourceTableType: AnalyticsTableHookResourceTableType
    sql: string
}

export interface ApiToken extends ModelBase {
    attributes: unknown[]
    expire: number
    type: Type
    version: number
}

export interface Attribute extends ModelBase {
    categoryAttribute: boolean
    categoryOptionAttribute: boolean
    categoryOptionComboAttribute: boolean
    categoryOptionGroupAttribute: boolean
    categoryOptionGroupSetAttribute: boolean
    constantAttribute: boolean
    dataElementAttribute: boolean
    dataElementGroupAttribute: boolean
    dataElementGroupSetAttribute: boolean
    dataSetAttribute: boolean
    description: string
    displayDescription: string
    displayFormName: string
    displayShortName: string
    documentAttribute: boolean
    eventChartAttribute: boolean
    eventReportAttribute: boolean
    formName: string
    indicatorAttribute: boolean
    indicatorGroupAttribute: boolean
    legendSetAttribute: boolean
    mandatory: boolean
    mapAttribute: boolean
    objectTypes: string
    optionAttribute: boolean
    optionSet: OptionSet
    optionSetAttribute: boolean
    organisationUnitAttribute: boolean
    organisationUnitGroupAttribute: boolean
    organisationUnitGroupSetAttribute: boolean
    programAttribute: boolean
    programIndicatorAttribute: boolean
    programStageAttribute: boolean
    relationshipTypeAttribute: boolean
    sectionAttribute: boolean
    shortName: string
    sortOrder: number
    sqlViewAttribute: boolean
    trackedEntityAttributeAttribute: boolean
    trackedEntityTypeAttribute: boolean
    unique: boolean
    userAttribute: boolean
    userGroupAttribute: boolean
    validationRuleAttribute: boolean
    validationRuleGroupAttribute: boolean
    valueType: ValueType
    visualizationAttribute: boolean
}

export interface AttributeValue {
    attribute: Attribute
    value: string
}

export interface Axis {
    axis: number
    dimensionalItem: string
}

export interface Category extends ModelBase {
    aggregationType: AggregationType
    allItems: boolean
    categoryCombos: CategoryCombo[]
    categoryOptions: CategoryOption[]
    dataDimension: boolean
    dataDimensionType: DataDimensionType
    description: string
    dimension: string
    dimensionItemKeywords: unknown
    dimensionType: DimensionType
    displayDescription: string
    displayFormName: string
    displayShortName: string
    filter: string
    formName: string
    items: unknown[]
    legendSet: LegendSet
    optionSet: OptionSet
    programStage: ProgramStage
    repetition: EventRepetition
    shortName: string
    valueType: ValueType
}

export interface CategoryCombo extends ModelBase {
    categories: Category[]
    categoryOptionCombos: CategoryOptionCombo[]
    dataDimensionType: DataDimensionType
    isDefault: boolean
    skipTotal: boolean
}

export interface CategoryDimension {
    category: Category
    categoryOptions: object
}

export interface CategoryOption extends ModelBase {
    access: AccessWithData
    aggregationType: AggregationType
    categories: Category[]
    categoryOptionCombos: CategoryOptionCombo[]
    categoryOptionGroups: CategoryOptionGroup[]
    description: string
    dimensionItem: string
    dimensionItemType: DimensionItemType
    displayDescription: string
    displayFormName: string
    displayShortName: string
    endDate: string
    formName: string
    isDefault: boolean
    legendSet: LegendSet
    legendSets: LegendSet[]
    organisationUnits: OrganisationUnit[]
    queryMods: unknown
    shortName: string
    startDate: string
    style: ObjectStyle
}

export interface CategoryOptionCombo extends ModelBase {
    aggregationType: AggregationType
    categoryCombo: CategoryCombo
    categoryOptions: CategoryOption[]
    description: string
    dimensionItem: string
    dimensionItemType: DimensionItemType
    displayDescription: string
    displayFormName: string
    displayShortName: string
    formName: string
    ignoreApproval: boolean
    legendSet: LegendSet
    legendSets: LegendSet[]
    queryMods: unknown
    shortName: string
}

export interface CategoryOptionGroup extends ModelBase {
    aggregationType: AggregationType
    categoryOptions: CategoryOption[]
    dataDimensionType: DataDimensionType
    description: string
    dimensionItem: string
    dimensionItemType: DimensionItemType
    displayDescription: string
    displayFormName: string
    displayShortName: string
    formName: string
    groupSets: CategoryOptionGroupSet[]
    legendSet: LegendSet
    legendSets: LegendSet[]
    queryMods: unknown
    shortName: string
}

export interface CategoryOptionGroupSet extends ModelBase {
    aggregationType: AggregationType
    allItems: boolean
    categoryOptionGroups: CategoryOptionGroup[]
    dataDimension: boolean
    dataDimensionType: DataDimensionType
    description: string
    dimension: string
    dimensionItemKeywords: unknown
    dimensionType: DimensionType
    displayDescription: string
    displayFormName: string
    displayShortName: string
    filter: string
    formName: string
    items: unknown[]
    legendSet: LegendSet
    optionSet: OptionSet
    programStage: ProgramStage
    repetition: EventRepetition
    shortName: string
    valueType: ValueType
}

export interface CategoryOptionGroupSetDimension {
    categoryOptionGroupSet: CategoryOptionGroupSet
    categoryOptionGroups: object
}

export interface Constant extends ModelBase {
    description: string
    displayDescription: string
    displayFormName: string
    displayShortName: string
    formName: string
    shortName: string
    value: number
}

export interface Dashboard extends ModelBase {
    allowedFilters: string[]
    dashboardItems: DashboardItem[]
    description: string
    displayDescription: string
    displayFormName: string
    displayShortName: string
    formName: string
    itemConfig: unknown
    itemCount: number
    layout: unknown
    restrictFilters: boolean
    shortName: string
}

export interface DashboardItem extends ModelBase {
    appKey: string
    contentCount: number
    eventChart: EventChart
    eventReport: EventReport
    eventVisualization: EventVisualization
    height: number
    interpretationCount: number
    interpretationLikeCount: number
    map: Map
    messages: boolean
    reports: Report[]
    resources: Document[]
    shape: DashboardItemShape
    text: string
    type: Type
    users: User[]
    visualization: Visualization
    width: number
    x: number
    y: number
}

export interface DataApprovalLevel extends ModelBase {
    categoryOptionGroupSet: CategoryOptionGroupSet
    level: number
    orgUnitLevel: number
    orgUnitLevelName: string
}

export interface DataApprovalWorkflow extends ModelBase {
    categoryCombo: CategoryCombo
    dataApprovalLevels: DataApprovalLevel[]
    dataSets: DataSet[]
    periodType: string
}

export interface DataElement extends ModelBase {
    aggregationLevels: number[]
    aggregationType: AggregationType
    categoryCombo: CategoryCombo
    commentOptionSet: OptionSet
    dataElementGroups: DataElementGroup[]
    dataSetElements: DataSetElement[]
    description: string
    dimensionItem: string
    dimensionItemType: DimensionItemType
    displayDescription: string
    displayFormName: string
    displayShortName: string
    domainType: DataElementDomainType
    fieldMask: string
    formName: string
    legendSet: LegendSet
    legendSets: LegendSet[]
    optionSet: OptionSet
    optionSetValue: boolean
    queryMods: unknown
    shortName: string
    style: ObjectStyle
    url: string
    valueType: ValueType
    valueTypeOptions: unknown
    zeroIsSignificant: boolean
}

export interface DataElementGroup extends ModelBase {
    aggregationType: AggregationType
    dataElements: DataElement[]
    description: string
    dimensionItem: string
    dimensionItemType: DimensionItemType
    displayDescription: string
    displayFormName: string
    displayShortName: string
    formName: string
    groupSets: DataElementGroupSet[]
    legendSet: LegendSet
    legendSets: LegendSet[]
    queryMods: unknown
    shortName: string
}

export interface DataElementGroupSet extends ModelBase {
    aggregationType: AggregationType
    allItems: boolean
    compulsory: boolean
    dataDimension: boolean
    dataDimensionType: DataDimensionType
    dataElementGroups: DataElementGroup[]
    description: string
    dimension: string
    dimensionItemKeywords: unknown
    dimensionType: DimensionType
    displayDescription: string
    displayFormName: string
    displayShortName: string
    filter: string
    formName: string
    items: unknown[]
    legendSet: LegendSet
    optionSet: OptionSet
    programStage: ProgramStage
    repetition: EventRepetition
    shortName: string
    valueType: ValueType
}

export interface DataElementGroupSetDimension {
    dataElementGroupSet: DataElementGroupSet
    dataElementGroups: object
}

export interface DataElementOperand extends ModelBase {
    aggregationType: AggregationType
    attributeOptionCombo: CategoryOptionCombo
    categoryOptionCombo: CategoryOptionCombo
    dataElement: DataElement
    description: string
    dimensionItem: string
    dimensionItemType: DimensionItemType
    displayDescription: string
    displayFormName: string
    displayShortName: string
    formName: string
    legendSet: LegendSet
    legendSets: LegendSet[]
    queryMods: unknown
    shortName: string
}

export interface DataEntryForm extends ModelBase {
    format: number
    htmlCode: string
    style: DataEntryFormStyle
}

export interface DataInputPeriod {
    closingDate: string
    openingDate: string
    period: ModelReference
}

export interface DataSet extends ModelBase {
    access: AccessWithData
    aggregationType: AggregationType
    categoryCombo: CategoryCombo
    compulsoryDataElementOperands: DataElementOperand[]
    compulsoryFieldsCompleteOnly: boolean
    dataElementDecoration: boolean
    dataEntryForm: DataEntryForm
    dataInputPeriods: DataInputPeriod[]
    dataSetElements: DataSetElement[]
    description: string
    dimensionItem: string
    dimensionItemType: DimensionItemType
    displayDescription: string
    displayFormName: string
    displayShortName: string
    expiryDays: number
    fieldCombinationRequired: boolean
    formName: string
    formType: FormType
    indicators: Indicator[]
    interpretations: Interpretation[]
    legendSet: LegendSet
    legendSets: LegendSet[]
    mobile: boolean
    noValueRequiresComment: boolean
    notificationRecipients: UserGroup
    notifyCompletingUser: boolean
    openFuturePeriods: number
    openPeriodsAfterCoEndDate: number
    organisationUnits: OrganisationUnit[]
    periodType: string
    queryMods: unknown
    renderAsTabs: boolean
    renderHorizontally: boolean
    sections: Section[]
    shortName: string
    skipOffline: boolean
    style: ObjectStyle
    timelyDays: number
    validCompleteOnly: boolean
    version: number
    workflow: DataApprovalWorkflow
}

export interface DataSetElement {
    categoryCombo: CategoryCombo
    dataElement: DataElement
    dataSet: DataSet
}

export interface DataSetNotificationTemplate extends ModelBase {
    dataSetNotificationTrigger: DataSetNotificationTemplateDataSetNotificationTrigger
    dataSets: DataSet[]
    deliveryChannels: never[]
    displayMessageTemplate: string
    displaySubjectTemplate: string
    messageTemplate: string
    notificationRecipient: DataSetNotificationTemplateNotificationRecipient
    notifyParentOrganisationUnitOnly: boolean
    notifyUsersInHierarchyOnly: boolean
    recipientUserGroup: UserGroup
    relativeScheduledDays: number
    sendStrategy: SendStrategy
    subjectTemplate: string
}

export interface DatastoreEntry extends ModelBase {
    key: string
    namespace: string
    value: string
}

export interface Document extends ModelBase {
    attachment: boolean
    contentType: string
    external: boolean
    url: string
}

export interface EventChart extends ModelBase {
    aggregationType: AggregationType
    attributeDimensions: unknown[]
    attributeValueDimension: TrackedEntityAttribute
    baseLineLabel: string
    baseLineValue: number
    categoryDimensions: CategoryDimension[]
    categoryOptionGroupSetDimensions: CategoryOptionGroupSetDimension[]
    collapseDataDimensions: boolean
    columnDimensions: string[]
    columns: unknown[]
    completedOnly: boolean
    cumulativeValues: boolean
    dataDimensionItems: unknown[]
    dataElementDimensions: TrackedEntityDataElementDimension[]
    dataElementGroupSetDimensions: DataElementGroupSetDimension[]
    dataElementValueDimension: DataElement
    description: string
    digitGroupSeparator: DigitGroupSeparator
    displayBaseLineLabel: string
    displayDescription: string
    displayDomainAxisLabel: string
    displayFormName: string
    displayRangeAxisLabel: string
    displayShortName: string
    displaySubtitle: string
    displayTargetLineLabel: string
    displayTitle: string
    domainAxisLabel: string
    endDate: string
    eventStatus: EventStatus
    filterDimensions: string[]
    filters: unknown[]
    formName: string
    hideEmptyRowItems: HideEmptyRowItems
    hideLegend: boolean
    hideNaData: boolean
    hideSubtitle: boolean
    hideTitle: boolean
    interpretations: Interpretation[]
    itemOrganisationUnitGroups: OrganisationUnitGroup[]
    legacy: boolean
    legendDisplayStrategy: EventChartLegendDisplayStrategy
    legendSet: LegendSet
    noSpaceBetweenColumns: boolean
    orgUnitField: string
    organisationUnitGroupSetDimensions: OrganisationUnitGroupSetDimension[]
    organisationUnitLevels: number[]
    organisationUnits: OrganisationUnit[]
    outputType: OutputType
    parentGraphMap: Record<string, unknown>
    percentStackedValues: boolean
    periods: ModelReference[]
    program: Program
    programIndicatorDimensions: TrackedEntityProgramIndicatorDimension[]
    programStage: ProgramStage
    programStatus: ProgramStatus
    rangeAxisDecimals: number
    rangeAxisLabel: string
    rangeAxisMaxValue: number
    rangeAxisMinValue: number
    rangeAxisSteps: number
    regressionType: RegressionType
    relativePeriods: unknown
    rowDimensions: string[]
    rows: unknown[]
    shortName: string
    showData: boolean
    sortOrder: number
    startDate: string
    subscribed: boolean
    subscribers: string[]
    subtitle: string
    targetLineLabel: string
    targetLineValue: number
    timeField: string
    title: string
    topLimit: number
    type: Type
    userOrgUnitType: UserOrgUnitType
    userOrganisationUnit: boolean
    userOrganisationUnitChildren: boolean
    userOrganisationUnitGrandChildren: boolean
    value: unknown
    yearlySeries: string[]
}

export interface EventHook extends ModelBase {
    description: string
    disabled: boolean
    source: unknown
    targets: unknown[]
}

export interface EventRepetition {
    dimension: string
    indexes: number[]
    parent: EventRepetitionParent
}

export interface EventReport extends ModelBase {
    aggregationType: AggregationType
    attributeDimensions: unknown[]
    attributeValueDimension: TrackedEntityAttribute
    categoryDimensions: CategoryDimension[]
    categoryOptionGroupSetDimensions: CategoryOptionGroupSetDimension[]
    colSubTotals: boolean
    colTotals: boolean
    collapseDataDimensions: boolean
    columnDimensions: string[]
    columns: unknown[]
    completedOnly: boolean
    dataDimensionItems: unknown[]
    dataElementDimensions: TrackedEntityDataElementDimension[]
    dataElementGroupSetDimensions: DataElementGroupSetDimension[]
    dataElementValueDimension: DataElement
    dataType: DataType
    description: string
    digitGroupSeparator: DigitGroupSeparator
    displayDensity: DisplayDensity
    displayDescription: string
    displayFormName: string
    displayShortName: string
    displaySubtitle: string
    displayTitle: string
    endDate: string
    eventStatus: EventStatus
    filterDimensions: string[]
    filters: unknown[]
    fontSize: FontSize
    formName: string
    hideEmptyRows: boolean
    hideNaData: boolean
    hideSubtitle: boolean
    hideTitle: boolean
    interpretations: Interpretation[]
    itemOrganisationUnitGroups: OrganisationUnitGroup[]
    legacy: boolean
    orgUnitField: string
    organisationUnitGroupSetDimensions: OrganisationUnitGroupSetDimension[]
    organisationUnitLevels: number[]
    organisationUnits: OrganisationUnit[]
    outputType: OutputType
    parentGraphMap: Record<string, unknown>
    periods: ModelReference[]
    program: Program
    programIndicatorDimensions: TrackedEntityProgramIndicatorDimension[]
    programStage: ProgramStage
    programStatus: ProgramStatus
    relativePeriods: unknown
    rowDimensions: string[]
    rowSubTotals: boolean
    rowTotals: boolean
    rows: unknown[]
    shortName: string
    showDimensionLabels: boolean
    showHierarchy: boolean
    simpleDimensions: unknown[]
    sortOrder: number
    startDate: string
    subscribed: boolean
    subscribers: string[]
    subtitle: string
    timeField: string
    title: string
    topLimit: number
    type: Type
    userOrgUnitType: UserOrgUnitType
    userOrganisationUnit: boolean
    userOrganisationUnitChildren: boolean
    userOrganisationUnitGrandChildren: boolean
    value: unknown
}

export interface EventVisualization extends ModelBase {
    aggregationType: AggregationType
    attributeDimensions: unknown[]
    attributeValueDimension: TrackedEntityAttribute
    baseLineLabel: string
    baseLineValue: number
    categoryDimensions: CategoryDimension[]
    categoryOptionGroupSetDimensions: CategoryOptionGroupSetDimension[]
    colSubTotals: boolean
    colTotals: boolean
    collapseDataDimensions: boolean
    columnDimensions: string[]
    columns: unknown[]
    completedOnly: boolean
    cumulativeValues: boolean
    dataDimensionItems: unknown[]
    dataElementDimensions: TrackedEntityDataElementDimension[]
    dataElementGroupSetDimensions: DataElementGroupSetDimension[]
    dataElementValueDimension: DataElement
    dataType: DataType
    description: string
    digitGroupSeparator: DigitGroupSeparator
    displayBaseLineLabel: string
    displayDensity: DisplayDensity
    displayDescription: string
    displayDomainAxisLabel: string
    displayFormName: string
    displayRangeAxisLabel: string
    displayShortName: string
    displaySubtitle: string
    displayTargetLineLabel: string
    displayTitle: string
    domainAxisLabel: string
    endDate: string
    eventStatus: EventStatus
    filterDimensions: string[]
    filters: unknown[]
    fontSize: FontSize
    formName: string
    hideEmptyRowItems: HideEmptyRowItems
    hideEmptyRows: boolean
    hideLegend: boolean
    hideNaData: boolean
    hideSubtitle: boolean
    hideTitle: boolean
    interpretations: Interpretation[]
    itemOrganisationUnitGroups: OrganisationUnitGroup[]
    legacy: boolean
    legend: unknown
    noSpaceBetweenColumns: boolean
    orgUnitField: string
    organisationUnitGroupSetDimensions: OrganisationUnitGroupSetDimension[]
    organisationUnitLevels: number[]
    organisationUnits: OrganisationUnit[]
    outputType: OutputType
    parentGraphMap: Record<string, unknown>
    percentStackedValues: boolean
    periods: ModelReference[]
    program: Program
    programIndicatorDimensions: TrackedEntityProgramIndicatorDimension[]
    programStage: ProgramStage
    programStatus: ProgramStatus
    rangeAxisDecimals: number
    rangeAxisLabel: string
    rangeAxisMaxValue: number
    rangeAxisMinValue: number
    rangeAxisSteps: number
    regressionType: RegressionType
    relativePeriods: unknown
    repetitions: EventRepetition[]
    rowDimensions: string[]
    rowSubTotals: boolean
    rowTotals: boolean
    rows: unknown[]
    shortName: string
    showData: boolean
    showDimensionLabels: boolean
    showHierarchy: boolean
    simpleDimensions: unknown[]
    sortOrder: number
    startDate: string
    subscribed: boolean
    subscribers: string[]
    subtitle: string
    targetLineLabel: string
    targetLineValue: number
    timeField: string
    title: string
    topLimit: number
    type: Type
    userOrgUnitType: UserOrgUnitType
    userOrganisationUnit: boolean
    userOrganisationUnitChildren: boolean
    userOrganisationUnitGrandChildren: boolean
    value: unknown
}

export interface Expression {
    description: string
    displayDescription: string
    expression: string
    missingValueStrategy: MissingValueStrategy
    slidingWindow: boolean
    translations: Translation[]
}

export interface ExpressionDimensionItem extends ModelBase {
    aggregateExportAttributeOptionCombo: string
    aggregateExportCategoryOptionCombo: string
    aggregationType: AggregationType
    description: string
    dimensionItem: string
    dimensionItemType: DimensionItemType
    displayDescription: string
    displayFormName: string
    displayShortName: string
    expression: string
    formName: string
    legendSet: LegendSet
    legendSets: LegendSet[]
    missingValueStrategy: MissingValueStrategy
    queryMods: unknown
    shortName: string
    slidingWindow: boolean
}

export interface ExternalFileResource extends ModelBase {
    accessToken: string
    expires: string
    fileResource: FileResource
}

export interface ExternalMapLayer extends ModelBase {
    attribution: string
    imageFormat: ExternalMapLayerImageFormat
    layers: string
    legendSet: LegendSet
    legendSetUrl: string
    mapLayerPosition: ExternalMapLayerMapLayerPosition
    mapService: ExternalMapLayerMapService
    url: string
}

export interface FileResource extends ModelBase {
    contentLength: string
    contentMd5: string
    contentType: string
    domain: FileResourceDomain
    hasMultipleStorageFiles: boolean
    storageStatus: FileResourceStorageStatus
}

// no schema and cant find any information about this
export type Icon = unknown

export interface Indicator extends ModelBase {
    aggregateExportAttributeOptionCombo: string
    aggregateExportCategoryOptionCombo: string
    aggregationType: AggregationType
    annualized: boolean
    dataSets: DataSet[]
    decimals: number
    denominator: string
    denominatorDescription: string
    description: string
    dimensionItem: string
    dimensionItemType: DimensionItemType
    displayDenominatorDescription: string
    displayDescription: string
    displayFormName: string
    displayNumeratorDescription: string
    displayShortName: string
    explodedDenominator: string
    explodedNumerator: string
    formName: string
    indicatorGroups: IndicatorGroup[]
    indicatorType: IndicatorType
    legendSet: LegendSet
    legendSets: LegendSet[]
    numerator: string
    numeratorDescription: string
    queryMods: unknown
    shortName: string
    style: ObjectStyle
    url: string
}

export interface IndicatorGroup extends ModelBase {
    description: string
    groupSets: IndicatorGroupSet[]
    indicatorGroupSet: IndicatorGroupSet
    indicators: Indicator[]
}

export interface IndicatorGroupSet extends ModelBase {
    compulsory: boolean
    description: string
    indicatorGroups: IndicatorGroup[]
    shortName: string
}

export interface IndicatorType extends ModelBase {
    factor: number
    number: boolean
}

export interface Interpretation extends ModelBase {
    comments: InterpretationComment[]
    dataSet: DataSet
    eventChart: EventChart
    eventReport: EventReport
    eventVisualization: EventVisualization
    likedBy: User[]
    likes: number
    map: Map
    mentions: unknown[]
    organisationUnit: OrganisationUnit
    period: ModelReference
    text: string
    type: Type
    visualization: Visualization
}

export interface InterpretationComment extends ModelBase {
    mentions: unknown[]
    text: string
}

export interface ItemConfig {
    insertHeight: number
    insertPosition: ItemConfigInsertPosition
}

export interface JobConfiguration extends ModelBase {
    configurable: boolean
    cronExpression: string
    delay: number
    enabled: boolean
    jobParameters: unknown
    jobStatus: JobConfigurationJobStatus
    jobType: JobConfigurationJobType
    lastExecuted: string
    lastExecutedStatus: JobConfigurationLastExecutedStatus
    lastRuntimeExecution: string
    leaderOnlyJob: boolean
    nextExecutionTime: string
    schedulingType: JobConfigurationSchedulingType
    userUid: string
}

export interface Legend extends ModelBase {
    color: string
    endValue: number
    image: string
    startValue: number
}

export interface LegendDefinitions {
    set: LegendSet
    showKey: boolean
    strategy: LegendDefinitionsStrategy
    style: LegendDefinitionsStyle
}

export interface LegendSet extends ModelBase {
    legends: Legend[]
    symbolizer: string
}

export interface Map extends ModelBase {
    basemap: string
    description: string
    displayDescription: string
    displayFormName: string
    displayShortName: string
    formName: string
    interpretations: Interpretation[]
    latitude: number
    longitude: number
    mapViews: MapView[]
    shortName: string
    subscribed: boolean
    subscribers: string[]
    title: string
    zoom: number
}

export interface MapView extends ModelBase {
    aggregationType: AggregationType
    areaRadius: number
    attributeDimensions: unknown[]
    categoryDimensions: CategoryDimension[]
    categoryOptionGroupSetDimensions: CategoryOptionGroupSetDimension[]
    classes: number
    colorHigh: string
    colorLow: string
    colorScale: string
    columnDimensions: string[]
    columns: unknown[]
    completedOnly: boolean
    config: string
    dataDimensionItems: unknown[]
    dataElementDimensions: TrackedEntityDataElementDimension[]
    dataElementGroupSetDimensions: DataElementGroupSetDimension[]
    description: string
    digitGroupSeparator: DigitGroupSeparator
    displayDescription: string
    displayFormName: string
    displayShortName: string
    displaySubtitle: string
    displayTitle: string
    endDate: string
    eventClustering: boolean
    eventCoordinateField: string
    eventPointColor: string
    eventPointRadius: number
    eventStatus: EventStatus
    filterDimensions: string[]
    filters: unknown[]
    followUp: boolean
    formName: string
    hidden: boolean
    hideSubtitle: boolean
    hideTitle: boolean
    interpretations: Interpretation[]
    itemOrganisationUnitGroups: OrganisationUnitGroup[]
    labelFontColor: string
    labelFontSize: string
    labelFontStyle: string
    labelFontWeight: string
    labelTemplate: string
    labels: boolean
    layer: string
    legendSet: LegendSet
    method: number
    noDataColor: string
    opacity: number
    orgUnitField: string
    orgUnitFieldDisplayName: string
    organisationUnitColor: string
    organisationUnitGroupSet: OrganisationUnitGroupSet
    organisationUnitGroupSetDimensions: OrganisationUnitGroupSetDimension[]
    organisationUnitLevels: number[]
    organisationUnitSelectionMode: MapViewOrganisationUnitSelectionMode
    organisationUnits: OrganisationUnit[]
    parentGraph: string
    parentGraphMap: Record<string, unknown>
    parentLevel: number
    periods: ModelReference[]
    program: Program
    programIndicatorDimensions: TrackedEntityProgramIndicatorDimension[]
    programStage: ProgramStage
    programStatus: ProgramStatus
    radiusHigh: number
    radiusLow: number
    relativePeriods: unknown
    renderingStrategy: MapViewRenderingStrategy
    rows: unknown[]
    shortName: string
    sortOrder: number
    startDate: string
    styleDataItem: object
    subscribed: boolean
    subscribers: string[]
    subtitle: string
    thematicMapType: MapViewThematicMapType
    timeField: string
    title: string
    topLimit: number
    trackedEntityType: TrackedEntityType
    userOrgUnitType: UserOrgUnitType
    userOrganisationUnit: boolean
    userOrganisationUnitChildren: boolean
    userOrganisationUnitGrandChildren: boolean
}

export interface MessageConversation extends ModelBase {
    assignee: User
    extMessageId: string
    followUp: boolean
    lastMessage: string
    lastSender: User
    lastSenderFirstname: string
    lastSenderSurname: string
    messageCount: number
    messageType: MessageConversationMessageType
    messages: unknown[]
    priority: MessageConversationPriority
    read: boolean
    status: MessageConversationStatus
    subject: string
    userFirstname: string
    userMessages: unknown[]
    userSurname: string
}

export interface MetadataProposal {
    change: unknown
    comment: string
    created: string
    createdBy: User
    finalised: string
    finalisedBy: User
    id: string
    reason: string
    status: MetadataProposalStatus
    target: MetadataProposalTarget
    targetId: string
    type: Type
}

export interface MetadataVersion extends ModelBase {
    hashCode: string
    importDate: string
    type: Type
}

export interface MinMaxDataElement {
    dataElement: DataElement
    generated: boolean
    max: number
    min: number
    optionCombo: CategoryOptionCombo
    source: OrganisationUnit
}

export interface OAuth2Client extends ModelBase {
    cid: string
    grantTypes: string[]
    redirectUris: string[]
    secret: string
}

export interface ObjectStyle {
    color: string
    icon: string
}

export interface Option extends ModelBase {
    description: string
    displayDescription: string
    displayFormName: string
    displayShortName: string
    formName: string
    optionSet: OptionSet
    shortName: string
    sortOrder: number
    style: ObjectStyle
}

export interface OptionGroup extends ModelBase {
    aggregationType: AggregationType
    description: string
    dimensionItem: string
    dimensionItemType: DimensionItemType
    displayDescription: string
    displayFormName: string
    displayShortName: string
    formName: string
    legendSet: LegendSet
    legendSets: LegendSet[]
    optionSet: OptionSet
    options: Option[]
    queryMods: unknown
    shortName: string
}

export interface OptionGroupSet extends ModelBase {
    aggregationType: AggregationType
    allItems: boolean
    dataDimension: boolean
    dataDimensionType: DataDimensionType
    description: string
    dimension: string
    dimensionItemKeywords: unknown
    dimensionType: DimensionType
    displayDescription: string
    displayFormName: string
    displayShortName: string
    filter: string
    formName: string
    items: unknown[]
    legendSet: LegendSet
    optionGroups: OptionGroup[]
    optionSet: OptionSet
    programStage: ProgramStage
    repetition: EventRepetition
    shortName: string
    valueType: ValueType
}

export interface OptionSet extends ModelBase {
    description: string
    options: Option[]
    valueType: ValueType
    version: number
}

export interface OrganisationUnit extends ModelBase {
    address: string
    aggregationType: AggregationType
    ancestors: OrganisationUnit[]
    children: OrganisationUnit[]
    closedDate: string
    comment: string
    contactPerson: string
    dataSets: DataSet[]
    description: string
    dimensionItem: string
    dimensionItemType: DimensionItemType
    displayDescription: string
    displayFormName: string
    displayShortName: string
    email: string
    formName: string
    geometry: Geometry
    image: FileResource
    leaf: boolean
    legendSet: LegendSet
    legendSets: LegendSet[]
    level: string
    memberCount: number
    openingDate: string
    organisationUnitGroups: OrganisationUnitGroup[]
    parent: OrganisationUnit
    path: string
    phoneNumber: string
    programs: Program[]
    queryMods: unknown
    shortName: string
    type: string
    url: string
    users: User[]
}

export interface OrganisationUnitGroup extends ModelBase {
    aggregationType: AggregationType
    color: string
    description: string
    dimensionItem: string
    dimensionItemType: DimensionItemType
    displayDescription: string
    displayFormName: string
    displayShortName: string
    featureType: FeatureType
    formName: string
    geometry: Geometry
    groupSets: OrganisationUnitGroupSet[]
    legendSet: LegendSet
    legendSets: LegendSet[]
    organisationUnits: OrganisationUnit[]
    queryMods: unknown
    shortName: string
    symbol: string
}

export interface OrganisationUnitGroupSet extends ModelBase {
    aggregationType: AggregationType
    allItems: boolean
    compulsory: boolean
    dataDimension: boolean
    dataDimensionType: DataDimensionType
    description: string
    dimension: string
    dimensionItemKeywords: unknown
    dimensionType: DimensionType
    displayDescription: string
    displayFormName: string
    displayShortName: string
    filter: string
    formName: string
    includeSubhierarchyInAnalytics: boolean
    items: unknown[]
    legendSet: LegendSet
    optionSet: OptionSet
    organisationUnitGroups: OrganisationUnitGroup[]
    programStage: ProgramStage
    repetition: EventRepetition
    shortName: string
    valueType: ValueType
}

export interface OrganisationUnitGroupSetDimension {
    organisationUnitGroupSet: OrganisationUnitGroupSet
    organisationUnitGroups: object
}

export interface OrganisationUnitLevel extends ModelBase {
    level: number
    offlineLevels: number
}

export interface OutlierAnalysis {
    enabled: boolean
    extremeLines: unknown
    normalizationMethod: OutlierAnalysisNormalizationMethod
    outlierMethod: OutlierAnalysisOutlierMethod
    thresholdFactor: number
}

export interface Predictor extends ModelBase {
    annualSampleCount: number
    description: string
    displayDescription: string
    displayFormName: string
    displayShortName: string
    formName: string
    generator: Expression
    organisationUnitDescendants: PredictorOrganisationUnitDescendants
    organisationUnitLevels: OrganisationUnitLevel[]
    output: DataElement
    outputCombo: CategoryOptionCombo
    periodType: string
    predictorGroups: PredictorGroup[]
    sampleSkipTest: Expression
    sequentialSampleCount: number
    sequentialSkipCount: number
    shortName: string
}

export interface PredictorGroup extends ModelBase {
    description: string
    predictors: Predictor[]
}

export interface Program extends ModelBase {
    access: AccessWithData
    accessLevel: ProgramAccessLevel
    categoryCombo: CategoryCombo
    completeEventsExpiryDays: number
    dataEntryForm: DataEntryForm
    description: string
    displayDescription: string
    displayEnrollmentDateLabel: string
    displayFormName: string
    displayFrontPageList: boolean
    displayIncidentDate: boolean
    displayIncidentDateLabel: string
    displayShortName: string
    enrollmentDateLabel: string
    expiryDays: number
    expiryPeriodType: string
    featureType: FeatureType
    formName: string
    ignoreOverdueEvents: boolean
    incidentDateLabel: string
    maxTeiCountToReturn: number
    minAttributesRequiredToSearch: number
    notificationTemplates: ProgramNotificationTemplate[]
    onlyEnrollOnce: boolean
    openDaysAfterCoEndDate: number
    organisationUnits: OrganisationUnit[]
    programIndicators: ProgramIndicator[]
    programRuleVariables: ProgramRuleVariable[]
    programSections: ProgramSection[]
    programStages: ProgramStage[]
    programTrackedEntityAttributes: ProgramTrackedEntityAttribute[]
    programType: ProgramProgramType
    registration: boolean
    relatedProgram: Program
    selectEnrollmentDatesInFuture: boolean
    selectIncidentDatesInFuture: boolean
    shortName: string
    skipOffline: boolean
    style: ObjectStyle
    trackedEntityType: TrackedEntityType
    useFirstStageDuringRegistration: boolean
    userRoles: UserRole[]
    version: number
    withoutRegistration: boolean
}

export interface ProgramDataElementDimensionItem extends ModelBase {
    aggregationType: AggregationType
    dataElement: DataElement
    description: string
    dimensionItem: string
    dimensionItemType: DimensionItemType
    displayDescription: string
    displayFormName: string
    displayShortName: string
    formName: string
    legendSet: LegendSet
    legendSets: LegendSet[]
    program: Program
    queryMods: unknown
    shortName: string
    valueType: ValueType
}

export interface ProgramIndicator extends ModelBase {
    aggregateExportAttributeOptionCombo: string
    aggregateExportCategoryOptionCombo: string
    aggregationType: AggregationType
    analyticsPeriodBoundaries: AnalyticsPeriodBoundary[]
    analyticsType: ProgramIndicatorAnalyticsType
    decimals: number
    description: string
    dimensionItem: string
    dimensionItemType: DimensionItemType
    displayDescription: string
    displayFormName: string
    displayInForm: boolean
    displayShortName: string
    expression: string
    filter: string
    formName: string
    legendSet: LegendSet
    legendSets: LegendSet[]
    orgUnitField: string
    program: Program
    programIndicatorGroups: ProgramIndicatorGroup[]
    queryMods: unknown
    shortName: string
    style: ObjectStyle
}

export interface ProgramIndicatorGroup extends ModelBase {
    description: string
    programIndicators: ProgramIndicator[]
}

export interface ProgramInstance extends ModelBase {
    completedBy: string
    createdAtClient: string
    createdByUserInfo: unknown
    deleted: boolean
    endDate: string
    enrollmentDate: string
    followup: boolean
    geometry: Geometry
    incidentDate: string
    lastUpdatedAtClient: string
    lastUpdatedByUserInfo: unknown
    messageConversations: MessageConversation[]
    organisationUnit: OrganisationUnit
    program: Program
    programStageInstances: ProgramStageInstance[]
    relationshipItems: unknown[]
    status: ProgramInstanceStatus
    storedBy: string
    trackedEntityComments: unknown[]
    trackedEntityInstance: TrackedEntityInstance
}

export interface ProgramNotificationTemplate extends ModelBase {
    deliveryChannels: never[]
    displayMessageTemplate: string
    displaySubjectTemplate: string
    messageTemplate: string
    notificationRecipient: ProgramNotificationTemplateNotificationRecipient
    notificationTrigger: ProgramNotificationTemplateNotificationTrigger
    notifyParentOrganisationUnitOnly: boolean
    notifyUsersInHierarchyOnly: boolean
    recipientDataElement: DataElement
    recipientProgramAttribute: TrackedEntityAttribute
    recipientUserGroup: UserGroup
    relativeScheduledDays: number
    sendRepeatable: boolean
    subjectTemplate: string
}

export interface ProgramRule extends ModelBase {
    condition: string
    description: string
    priority: number
    program: Program
    programRuleActions: ProgramRuleAction[]
    programStage: ProgramStage
}

export interface ProgramRuleAction extends ModelBase {
    content: string
    data: string
    dataElement: DataElement
    displayContent: string
    evaluationEnvironments: never[]
    evaluationTime: ProgramRuleActionEvaluationTime
    location: string
    option: Option
    optionGroup: OptionGroup
    programIndicator: ProgramIndicator
    programRule: ProgramRule
    programRuleActionType: ProgramRuleActionProgramRuleActionType
    programStage: ProgramStage
    programStageSection: ProgramStageSection
    templateUid: string
    trackedEntityAttribute: TrackedEntityAttribute
}

export interface ProgramRuleVariable extends ModelBase {
    dataElement: DataElement
    program: Program
    programRuleVariableSourceType: ProgramRuleVariableProgramRuleVariableSourceType
    programStage: ProgramStage
    trackedEntityAttribute: TrackedEntityAttribute
    useCodeForOptionSet: boolean
    valueType: ValueType
}

export interface ProgramSection extends ModelBase {
    description: string
    displayDescription: string
    displayFormName: string
    displayShortName: string
    formName: string
    program: Program
    renderType: unknown
    shortName: string
    sortOrder: number
    style: ObjectStyle
    trackedEntityAttributes: TrackedEntityAttribute[]
}

export interface ProgramStage extends ModelBase {
    access: AccessWithData
    allowGenerateNextVisit: boolean
    autoGenerateEvent: boolean
    blockEntryForm: boolean
    dataEntryForm: DataEntryForm
    description: string
    displayDescription: string
    displayDueDateLabel: string
    displayExecutionDateLabel: string
    displayFormName: string
    displayGenerateEventBox: boolean
    displayShortName: string
    dueDateLabel: string
    enableUserAssignment: boolean
    executionDateLabel: string
    featureType: FeatureType
    formName: string
    formType: FormType
    generatedByEnrollmentDate: boolean
    hideDueDate: boolean
    minDaysFromStart: number
    nextScheduleDate: DataElement
    notificationTemplates: ProgramNotificationTemplate[]
    openAfterEnrollment: boolean
    periodType: string
    preGenerateUID: boolean
    program: Program
    programStageDataElements: ProgramStageDataElement[]
    programStageSections: ProgramStageSection[]
    referral: boolean
    remindCompleted: boolean
    repeatable: boolean
    reportDateToUse: string
    shortName: string
    sortOrder: number
    standardInterval: number
    style: ObjectStyle
    validationStrategy: ProgramStageValidationStrategy
}

export interface ProgramStageDataElement extends ModelBase {
    allowFutureDate: boolean
    allowProvidedElsewhere: boolean
    compulsory: boolean
    dataElement: DataElement
    displayInReports: boolean
    programStage: ProgramStage
    renderOptionsAsRadio: boolean
    renderType: unknown
    skipAnalytics: boolean
    skipSynchronization: boolean
    sortOrder: number
}

export interface ProgramStageInstance extends ModelBase {
    assignedUser: User
    attributeOptionCombo: CategoryOptionCombo
    comments: unknown[]
    completed: boolean
    completedBy: string
    completedDate: string
    creatableInSearchScope: boolean
    createdAtClient: string
    createdByUserInfo: unknown
    deleted: boolean
    dueDate: string
    eventDataValues: unknown[]
    eventDate: string
    geometry: Geometry
    lastUpdatedAtClient: string
    lastUpdatedByUserInfo: unknown
    messageConversations: MessageConversation[]
    organisationUnit: OrganisationUnit
    programInstance: ProgramInstance
    programStage: ProgramStage
    relationshipItems: unknown[]
    status: ProgramStageInstanceStatus
    storedBy: string
}

export interface ProgramStageInstanceFilter extends ModelBase {
    description: string
    displayDescription: string
    eventQueryCriteria: unknown
    program: string
    programStage: string
}

export interface ProgramStageSection extends ModelBase {
    dataElements: DataElement[]
    description: string
    displayDescription: string
    displayFormName: string
    displayShortName: string
    formName: string
    programIndicators: ProgramIndicator[]
    programStage: ProgramStage
    renderType: unknown
    shortName: string
    sortOrder: number
    style: ObjectStyle
}

export interface ProgramStageWorkingList extends ModelBase {
    description: string
    displayDescription: string
    program: Program
    programStage: ProgramStage
    programStageQueryCriteria: unknown
}

export interface ProgramTrackedEntityAttribute extends ModelBase {
    allowFutureDate: boolean
    displayInList: boolean
    displayShortName: string
    mandatory: boolean
    program: Program
    renderOptionsAsRadio: boolean
    renderType: unknown
    searchable: boolean
    sortOrder: number
    trackedEntityAttribute: TrackedEntityAttribute
    valueType: ValueType
}

export interface ProgramTrackedEntityAttributeDimensionItem extends ModelBase {
    aggregationType: AggregationType
    attribute: TrackedEntityAttribute
    description: string
    dimensionItem: string
    dimensionItemType: DimensionItemType
    displayDescription: string
    displayFormName: string
    displayShortName: string
    formName: string
    legendSet: LegendSet
    legendSets: LegendSet[]
    program: Program
    queryMods: unknown
    shortName: string
}

export interface PushAnalysis extends ModelBase {
    dashboard: Dashboard
    message: string
    recipientUserGroups: UserGroup[]
    title: string
}

export interface Relationship extends ModelBase {
    deleted: boolean
    description: string
    formName: string
    from: unknown
    relationshipType: RelationshipType
    style: ObjectStyle
    to: unknown
}

export interface RelationshipConstraint {
    program: Program
    programStage: ProgramStage
    relationshipEntity: RelationshipConstraintRelationshipEntity
    trackedEntityType: TrackedEntityType
    trackerDataView: unknown
}

export interface RelationshipItem {
    programInstance: ProgramInstance
    programStageInstance: ProgramStageInstance
    relationship: Relationship
    trackedEntityInstance: TrackedEntityInstance
}

export interface RelationshipType extends ModelBase {
    access: AccessWithData
    bidirectional: boolean
    description: string
    displayFromToName: string
    displayToFromName: string
    fromConstraint: RelationshipConstraint
    fromToName: string
    referral: boolean
    toConstraint: RelationshipConstraint
    toFromName: string
}

export interface Report extends ModelBase {
    cacheStrategy: CacheStrategy
    designContent: string
    relativePeriods: unknown
    reportParams: ReportingParams
    type: Type
    visualization: Visualization
}

export interface ReportingRate extends ModelBase {
    aggregationType: AggregationType
    dataSet: DataSet
    description: string
    dimensionItem: string
    dimensionItemType: DimensionItemType
    displayDescription: string
    displayFormName: string
    displayShortName: string
    formName: string
    legendSet: LegendSet
    legendSets: LegendSet[]
    metric: ReportingRateMetric
    queryMods: unknown
    shortName: string
}

export interface Route extends ModelBase {
    auth: unknown
    authorities: string[]
    description: string
    disabled: boolean
    headers: Record<string, unknown>
    url: string
}

export interface SMSCommand extends ModelBase {
    codeValueSeparator: string
    completenessMethod: SMSCommandCompletenessMethod
    currentPeriodUsedForReporting: boolean
    dataset: DataSet
    defaultMessage: string
    moreThanOneOrgUnitMessage: string
    noUserMessage: string
    parserType: SMSCommandParserType
    program: Program
    programStage: ProgramStage
    receivedMessage: string
    separator: string
    smsCodes: unknown[]
    specialCharacters: unknown[]
    successMessage: string
    userGroup: UserGroup
    wrongFormatMessage: string
}

export interface Section extends ModelBase {
    categoryCombos: CategoryCombo[]
    dataElements: DataElement[]
    dataSet: DataSet
    description: string
    disableDataElementAutoGroup: boolean
    greyedFields: DataElementOperand[]
    indicators: Indicator[]
    showColumnTotals: boolean
    showRowTotals: boolean
    sortOrder: number
}

export interface SeriesKey {
    hidden: boolean
    label: unknown
}

export interface Sharing {
    external: boolean
    owner: string
    public: string
    userGroups: Record<string, unknown>
    users: Record<string, unknown>
}

export interface SqlView extends ModelBase {
    access: AccessWithData
    cacheStrategy: CacheStrategy
    description: string
    sqlQuery: string
    type: Type
    updateJobId: string
}

export interface TrackedEntityAttribute extends ModelBase {
    aggregationType: AggregationType
    confidential: boolean
    description: string
    dimensionItem: string
    dimensionItemType: DimensionItemType
    displayDescription: string
    displayFormName: string
    displayInListNoProgram: boolean
    displayOnVisitSchedule: boolean
    displayShortName: string
    expression: string
    fieldMask: string
    formName: string
    generated: boolean
    inherit: boolean
    legendSet: LegendSet
    legendSets: LegendSet[]
    optionSet: OptionSet
    optionSetValue: boolean
    orgunitScope: boolean
    pattern: string
    queryMods: unknown
    shortName: string
    skipSynchronization: boolean
    sortOrderInListNoProgram: number
    sortOrderInVisitSchedule: number
    style: ObjectStyle
    unique: boolean
    valueType: ValueType
}

export interface TrackedEntityAttributeValue {
    created: string
    lastUpdated: string
    storedBy: string
    trackedEntityAttribute: TrackedEntityAttribute
    trackedEntityInstance: TrackedEntityInstance
    value: string
}

export interface TrackedEntityDataElementDimension {
    dataElement: DataElement
    filter: string
    legendSet: LegendSet
    programStage: ProgramStage
}

export interface TrackedEntityInstance extends ModelBase {
    createdAtClient: string
    createdByUserInfo: unknown
    deleted: boolean
    geometry: Geometry
    inactive: boolean
    lastUpdatedAtClient: string
    lastUpdatedByUserInfo: unknown
    organisationUnit: OrganisationUnit
    potentialDuplicate: boolean
    programInstances: ProgramInstance[]
    programOwners: ProgramOwner[]
    relationshipItems: unknown[]
    storedBy: string
    trackedEntityAttributeValues: TrackedEntityAttributeValue[]
    trackedEntityType: TrackedEntityType
}

export interface TrackedEntityInstanceFilter extends ModelBase {
    description: string
    displayDescription: string
    enrollmentCreatedPeriod: unknown
    enrollmentStatus: TrackedEntityInstanceFilterEnrollmentStatus
    entityQueryCriteria: unknown
    eventFilters: unknown[]
    followup: boolean
    program: Program
    sortOrder: number
    style: ObjectStyle
}

export interface TrackedEntityProgramIndicatorDimension {
    filter: string
    legendSet: LegendSet
    programIndicator: ProgramIndicator
}

export interface TrackedEntityType extends ModelBase {
    access: AccessWithData
    allowAuditLog: boolean
    description: string
    displayDescription: string
    displayFormName: string
    displayShortName: string
    featureType: FeatureType
    formName: string
    maxTeiCountToReturn: number
    minAttributesRequiredToSearch: number
    shortName: string
    style: ObjectStyle
    trackedEntityTypeAttributes: TrackedEntityTypeAttribute[]
}

export interface TrackedEntityTypeAttribute extends ModelBase {
    displayInList: boolean
    displayShortName: string
    mandatory: boolean
    searchable: boolean
    trackedEntityAttribute: TrackedEntityAttribute
    trackedEntityType: TrackedEntityType
    valueType: ValueType
}

export interface User extends ModelBase {
    accountExpiry: string
    avatar: FileResource
    birthday: string
    catDimensionConstraints: Category[]
    cogsDimensionConstraints: CategoryOptionGroupSet[]
    dataViewMaxOrganisationUnitLevel: number
    dataViewOrganisationUnits: OrganisationUnit[]
    disabled: boolean
    education: string
    email: string
    employer: string
    externalAuth: boolean
    facebookMessenger: string
    firstName: string
    gender: string
    interests: string
    introduction: string
    invitation: boolean
    jobTitle: string
    languages: string
    lastCheckedInterpretations: string
    lastLogin: string
    ldapId: string
    nationality: string
    openId: string
    organisationUnits: OrganisationUnit[]
    password: string
    passwordLastUpdated: string
    phoneNumber: string
    selfRegistered: boolean
    settings: string
    skype: string
    surname: string
    teiSearchOrganisationUnits: OrganisationUnit[]
    telegram: string
    twitter: string
    twoFactorEnabled: boolean
    userCredentials: UserCredentialsDto
    userGroups: UserGroup[]
    userRoles: UserRole[]
    username: string
    welcomeMessage: string
    whatsApp: string
}

export interface UserAccess {
    access: string
    displayName: string
    id: string
}

export interface UserCredentialsDto {
    access: Access
    accountExpiry: string
    catDimensionConstraints: Category[]
    cogsDimensionConstraints: CategoryOptionGroupSet[]
    disabled: boolean
    externalAuth: boolean
    id: string
    idToken: string
    invitation: boolean
    lastLogin: string
    ldapId: string
    openId: string
    password: string
    passwordLastUpdated: string
    previousPasswords: string[]
    restoreExpiry: string
    restoreToken: string
    selfRegistered: boolean
    sharing: Sharing
    twoFA: boolean
    uid: string
    userRoles: UserRole[]
    username: string
    uuid: string
}

export interface UserGroup extends ModelBase {
    managedByGroups: UserGroup[]
    managedGroups: UserGroup[]
    users: User[]
}

export interface UserGroupAccess {
    access: string
    displayName: string
    id: string
}

export interface UserRole extends ModelBase {
    authorities: string[]
    description: string
    restrictions: string[]
    users: User[]
}

export interface ValidationNotificationTemplate extends ModelBase {
    displayMessageTemplate: string
    displaySubjectTemplate: string
    messageTemplate: string
    notifyParentOrganisationUnitOnly: boolean
    notifyUsersInHierarchyOnly: boolean
    recipientUserGroups: UserGroup[]
    sendStrategy: SendStrategy
    subjectTemplate: string
    validationRules: ValidationRule[]
}

export interface ValidationResult {
    attributeOptionCombo: CategoryOptionCombo
    created: string
    dayInPeriod: number
    id: string
    leftsideValue: number
    notificationSent: boolean
    organisationUnit: OrganisationUnit
    period: ModelReference
    rightsideValue: number
    validationRule: ValidationRule
}

export interface ValidationRule extends ModelBase {
    aggregateExportAttributeOptionCombo: string
    aggregateExportCategoryOptionCombo: string
    aggregationType: AggregationType
    description: string
    dimensionItem: string
    dimensionItemType: DimensionItemType
    displayDescription: string
    displayFormName: string
    displayInstruction: string
    displayShortName: string
    formName: string
    importance: ValidationRuleImportance
    instruction: string
    leftSide: Expression
    legendSet: LegendSet
    legendSets: LegendSet[]
    notificationTemplates: ValidationNotificationTemplate[]
    operator: ValidationRuleOperator
    organisationUnitLevels: number[]
    periodType: string
    queryMods: unknown
    rightSide: Expression
    shortName: string
    skipFormValidation: boolean
    validationRuleGroups: ValidationRuleGroup[]
}

export interface ValidationRuleGroup extends ModelBase {
    description: string
    validationRules: ValidationRule[]
}

export interface Visualization extends ModelBase {
    aggregationType: AggregationType
    attributeDimensions: unknown[]
    axes: unknown[]
    baseLineLabel: string
    baseLineValue: number
    categoryDimensions: CategoryDimension[]
    categoryOptionGroupSetDimensions: CategoryOptionGroupSetDimension[]
    colSubTotals: boolean
    colTotals: boolean
    colorSet: string
    columnDimensions: string[]
    columns: unknown[]
    completedOnly: boolean
    cumulativeValues: boolean
    dataDimensionItems: unknown[]
    dataElementDimensions: TrackedEntityDataElementDimension[]
    dataElementGroupSetDimensions: DataElementGroupSetDimension[]
    description: string
    digitGroupSeparator: DigitGroupSeparator
    displayBaseLineLabel: string
    displayDensity: DisplayDensity
    displayDescription: string
    displayDomainAxisLabel: string
    displayFormName: string
    displayRangeAxisLabel: string
    displayShortName: string
    displaySubtitle: string
    displayTargetLineLabel: string
    displayTitle: string
    domainAxisLabel: string
    endDate: string
    filterDimensions: string[]
    filters: unknown[]
    fixColumnHeaders: boolean
    fixRowHeaders: boolean
    fontSize: FontSize
    fontStyle: unknown
    formName: string
    hideEmptyColumns: boolean
    hideEmptyRowItems: HideEmptyRowItems
    hideEmptyRows: boolean
    hideLegend: boolean
    hideSubtitle: boolean
    hideTitle: boolean
    icons: Icon[]
    interpretations: Interpretation[]
    itemOrganisationUnitGroups: OrganisationUnitGroup[]
    legend: unknown
    measureCriteria: string
    noSpaceBetweenColumns: boolean
    numberType: VisualizationNumberType
    optionalAxes: Axis[]
    orgUnitField: string
    organisationUnitGroupSetDimensions: OrganisationUnitGroupSetDimension[]
    organisationUnitLevels: number[]
    organisationUnits: OrganisationUnit[]
    outlierAnalysis: unknown
    parentGraphMap: Record<string, unknown>
    percentStackedValues: boolean
    periods: ModelReference[]
    programIndicatorDimensions: TrackedEntityProgramIndicatorDimension[]
    rangeAxisDecimals: number
    rangeAxisLabel: string
    rangeAxisMaxValue: number
    rangeAxisMinValue: number
    rangeAxisSteps: number
    regression: boolean
    regressionType: RegressionType
    relativePeriods: unknown
    reportingParams: ReportingParams
    rowDimensions: string[]
    rowSubTotals: boolean
    rowTotals: boolean
    rows: unknown[]
    series: unknown[]
    seriesKey: unknown
    shortName: string
    showData: boolean
    showDimensionLabels: boolean
    showHierarchy: boolean
    skipRounding: boolean
    sortOrder: number
    startDate: string
    subscribed: boolean
    subscribers: string[]
    subtitle: string
    targetLineLabel: string
    targetLineValue: number
    timeField: string
    title: string
    topLimit: number
    type: Type
    userOrgUnitType: UserOrgUnitType
    userOrganisationUnit: boolean
    userOrganisationUnitChildren: boolean
    userOrganisationUnitGrandChildren: boolean
    visualizationPeriodName: string
    yearlySeries: string[]
}

export enum AnalyticsPeriodBoundaryAnalyticsPeriodBoundaryType {
    AFTER_END_OF_REPORTING_PERIOD = 'AFTER_END_OF_REPORTING_PERIOD',
    AFTER_START_OF_REPORTING_PERIOD = 'AFTER_START_OF_REPORTING_PERIOD',
    BEFORE_END_OF_REPORTING_PERIOD = 'BEFORE_END_OF_REPORTING_PERIOD',
    BEFORE_START_OF_REPORTING_PERIOD = 'BEFORE_START_OF_REPORTING_PERIOD',
}

export enum AnalyticsTableHookAnalyticsTableType {
    COMPLETENESS = 'COMPLETENESS',
    COMPLETENESS_TARGET = 'COMPLETENESS_TARGET',
    DATA_VALUE = 'DATA_VALUE',
    ENROLLMENT = 'ENROLLMENT',
    EVENT = 'EVENT',
    ORG_UNIT_TARGET = 'ORG_UNIT_TARGET',
    OWNERSHIP = 'OWNERSHIP',
    VALIDATION_RESULT = 'VALIDATION_RESULT',
}

export enum AnalyticsTableHookPhase {
    ANALYTICS_TABLE_POPULATED = 'ANALYTICS_TABLE_POPULATED',
    RESOURCE_TABLE_POPULATED = 'RESOURCE_TABLE_POPULATED',
}

export enum AnalyticsTableHookResourceTableType {
    CATEGORY_OPTION_COMBO_NAME = 'CATEGORY_OPTION_COMBO_NAME',
    CATEGORY_STRUCTURE = 'CATEGORY_STRUCTURE',
    DATA_APPROVAL_MIN_LEVEL = 'DATA_APPROVAL_MIN_LEVEL',
    DATA_APPROVAL_REMAP_LEVEL = 'DATA_APPROVAL_REMAP_LEVEL',
    DATA_ELEMENT_CATEGORY_OPTION_COMBO = 'DATA_ELEMENT_CATEGORY_OPTION_COMBO',
    DATA_ELEMENT_GROUP_SET_STRUCTURE = 'DATA_ELEMENT_GROUP_SET_STRUCTURE',
    DATA_ELEMENT_STRUCTURE = 'DATA_ELEMENT_STRUCTURE',
    DATA_SET_ORG_UNIT_CATEGORY = 'DATA_SET_ORG_UNIT_CATEGORY',
    DATE_PERIOD_STRUCTURE = 'DATE_PERIOD_STRUCTURE',
    INDICATOR_GROUP_SET_STRUCTURE = 'INDICATOR_GROUP_SET_STRUCTURE',
    ORG_UNIT_GROUP_SET_STRUCTURE = 'ORG_UNIT_GROUP_SET_STRUCTURE',
    ORG_UNIT_STRUCTURE = 'ORG_UNIT_STRUCTURE',
    PERIOD_STRUCTURE = 'PERIOD_STRUCTURE',
}

export enum ApiTokenType {
    PERSONAL_ACCESS_TOKEN = 'PERSONAL_ACCESS_TOKEN',
}

export enum ValueType {
    AGE = 'AGE',
    BOOLEAN = 'BOOLEAN',
    COORDINATE = 'COORDINATE',
    DATE = 'DATE',
    DATETIME = 'DATETIME',
    EMAIL = 'EMAIL',
    FILE_RESOURCE = 'FILE_RESOURCE',
    GEOJSON = 'GEOJSON',
    IMAGE = 'IMAGE',
    INTEGER = 'INTEGER',
    INTEGER_NEGATIVE = 'INTEGER_NEGATIVE',
    INTEGER_POSITIVE = 'INTEGER_POSITIVE',
    INTEGER_ZERO_OR_POSITIVE = 'INTEGER_ZERO_OR_POSITIVE',
    LETTER = 'LETTER',
    LONG_TEXT = 'LONG_TEXT',
    MULTI_TEXT = 'MULTI_TEXT',
    NUMBER = 'NUMBER',
    ORGANISATION_UNIT = 'ORGANISATION_UNIT',
    PERCENTAGE = 'PERCENTAGE',
    PHONE_NUMBER = 'PHONE_NUMBER',
    REFERENCE = 'REFERENCE',
    TEXT = 'TEXT',
    TIME = 'TIME',
    TRACKER_ASSOCIATE = 'TRACKER_ASSOCIATE',
    TRUE_ONLY = 'TRUE_ONLY',
    UNIT_INTERVAL = 'UNIT_INTERVAL',
    URL = 'URL',
    USERNAME = 'USERNAME',
}

export enum DataDimensionType {
    ATTRIBUTE = 'ATTRIBUTE',
    DISAGGREGATION = 'DISAGGREGATION',
}

export enum DimensionType {
    ATTRIBUTE_OPTION_COMBO = 'ATTRIBUTE_OPTION_COMBO',
    CATEGORY = 'CATEGORY',
    CATEGORY_OPTION_COMBO = 'CATEGORY_OPTION_COMBO',
    CATEGORY_OPTION_GROUP_SET = 'CATEGORY_OPTION_GROUP_SET',
    DATA_COLLAPSED = 'DATA_COLLAPSED',
    DATA_ELEMENT_GROUP_SET = 'DATA_ELEMENT_GROUP_SET',
    DATA_X = 'DATA_X',
    OPTION_GROUP_SET = 'OPTION_GROUP_SET',
    ORGANISATION_UNIT = 'ORGANISATION_UNIT',
    ORGANISATION_UNIT_GROUP = 'ORGANISATION_UNIT_GROUP',
    ORGANISATION_UNIT_GROUP_SET = 'ORGANISATION_UNIT_GROUP_SET',
    ORGANISATION_UNIT_LEVEL = 'ORGANISATION_UNIT_LEVEL',
    PERIOD = 'PERIOD',
    PROGRAM_ATTRIBUTE = 'PROGRAM_ATTRIBUTE',
    PROGRAM_DATA_ELEMENT = 'PROGRAM_DATA_ELEMENT',
    PROGRAM_INDICATOR = 'PROGRAM_INDICATOR',
    STATIC = 'STATIC',
    VALIDATION_RULE = 'VALIDATION_RULE',
}

export enum AggregationType {
    AVERAGE = 'AVERAGE',
    AVERAGE_SUM_ORG_UNIT = 'AVERAGE_SUM_ORG_UNIT',
    COUNT = 'COUNT',
    CUSTOM = 'CUSTOM',
    DEFAULT = 'DEFAULT',
    FIRST = 'FIRST',
    FIRST_AVERAGE_ORG_UNIT = 'FIRST_AVERAGE_ORG_UNIT',
    FIRST_FIRST_ORG_UNIT = 'FIRST_FIRST_ORG_UNIT',
    LAST = 'LAST',
    LAST_AVERAGE_ORG_UNIT = 'LAST_AVERAGE_ORG_UNIT',
    LAST_IN_PERIOD = 'LAST_IN_PERIOD',
    LAST_IN_PERIOD_AVERAGE_ORG_UNIT = 'LAST_IN_PERIOD_AVERAGE_ORG_UNIT',
    LAST_LAST_ORG_UNIT = 'LAST_LAST_ORG_UNIT',
    MAX = 'MAX',
    MAX_SUM_ORG_UNIT = 'MAX_SUM_ORG_UNIT',
    MIN = 'MIN',
    MIN_SUM_ORG_UNIT = 'MIN_SUM_ORG_UNIT',
    NONE = 'NONE',
    STDDEV = 'STDDEV',
    SUM = 'SUM',
    VARIANCE = 'VARIANCE',
}

export enum DimensionItemType {
    CATEGORY_OPTION = 'CATEGORY_OPTION',
    CATEGORY_OPTION_GROUP = 'CATEGORY_OPTION_GROUP',
    DATA_ELEMENT = 'DATA_ELEMENT',
    DATA_ELEMENT_GROUP = 'DATA_ELEMENT_GROUP',
    DATA_ELEMENT_OPERAND = 'DATA_ELEMENT_OPERAND',
    EXPRESSION_DIMENSION_ITEM = 'EXPRESSION_DIMENSION_ITEM',
    INDICATOR = 'INDICATOR',
    OPTION_GROUP = 'OPTION_GROUP',
    ORGANISATION_UNIT = 'ORGANISATION_UNIT',
    ORGANISATION_UNIT_GROUP = 'ORGANISATION_UNIT_GROUP',
    PERIOD = 'PERIOD',
    PROGRAM_ATTRIBUTE = 'PROGRAM_ATTRIBUTE',
    PROGRAM_DATA_ELEMENT = 'PROGRAM_DATA_ELEMENT',
    PROGRAM_INDICATOR = 'PROGRAM_INDICATOR',
    REPORTING_RATE = 'REPORTING_RATE',
}

export enum DashboardItemType {
    APP = 'APP',
    EVENT_CHART = 'EVENT_CHART',
    EVENT_REPORT = 'EVENT_REPORT',
    EVENT_VISUALIZATION = 'EVENT_VISUALIZATION',
    MAP = 'MAP',
    MESSAGES = 'MESSAGES',
    REPORTS = 'REPORTS',
    RESOURCES = 'RESOURCES',
    TEXT = 'TEXT',
    USERS = 'USERS',
    VISUALIZATION = 'VISUALIZATION',
}

export enum DashboardItemShape {
    DOUBLE_WIDTH = 'DOUBLE_WIDTH',
    FULL_WIDTH = 'FULL_WIDTH',
    NORMAL = 'NORMAL',
}

export enum DataElementDomainType {
    AGGREGATE = 'AGGREGATE',
    TRACKER = 'TRACKER',
}

export enum DataEntryFormStyle {
    COMFORTABLE = 'COMFORTABLE',
    COMPACT = 'COMPACT',
    NONE = 'NONE',
    NORMAL = 'NORMAL',
}

export enum FormType {
    CUSTOM = 'CUSTOM',
    DEFAULT = 'DEFAULT',
    SECTION = 'SECTION',
    SECTION_MULTIORG = 'SECTION_MULTIORG',
}

export enum DataSetNotificationTemplateDataSetNotificationTrigger {
    DATA_SET_COMPLETION = 'DATA_SET_COMPLETION',
    SCHEDULED_DAYS = 'SCHEDULED_DAYS',
}

export enum SendStrategy {
    COLLECTIVE_SUMMARY = 'COLLECTIVE_SUMMARY',
    SINGLE_NOTIFICATION = 'SINGLE_NOTIFICATION',
}

export enum DataSetNotificationTemplateNotificationRecipient {
    ORGANISATION_UNIT_CONTACT = 'ORGANISATION_UNIT_CONTACT',
    USER_GROUP = 'USER_GROUP',
}

export enum Type {
    AREA = 'AREA',
    BAR = 'BAR',
    BUBBLE = 'BUBBLE',
    COLUMN = 'COLUMN',
    GAUGE = 'GAUGE',
    LINE = 'LINE',
    LINE_LIST = 'LINE_LIST',
    PIE = 'PIE',
    PIVOT_TABLE = 'PIVOT_TABLE',
    RADAR = 'RADAR',
    SCATTER = 'SCATTER',
    SINGLE_VALUE = 'SINGLE_VALUE',
    STACKED_AREA = 'STACKED_AREA',
    STACKED_BAR = 'STACKED_BAR',
    STACKED_COLUMN = 'STACKED_COLUMN',
    YEAR_OVER_YEAR_COLUMN = 'YEAR_OVER_YEAR_COLUMN',
    YEAR_OVER_YEAR_LINE = 'YEAR_OVER_YEAR_LINE',
}

export enum EventStatus {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    OVERDUE = 'OVERDUE',
    SCHEDULE = 'SCHEDULE',
    SKIPPED = 'SKIPPED',
    VISITED = 'VISITED',
}

export enum RegressionType {
    LINEAR = 'LINEAR',
    LOESS = 'LOESS',
    NONE = 'NONE',
    POLYNOMIAL = 'POLYNOMIAL',
}

export enum ProgramStatus {
    ACTIVE = 'ACTIVE',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
}

export enum HideEmptyRowItems {
    AFTER_LAST = 'AFTER_LAST',
    ALL = 'ALL',
    BEFORE_FIRST = 'BEFORE_FIRST',
    BEFORE_FIRST_AFTER_LAST = 'BEFORE_FIRST_AFTER_LAST',
    NONE = 'NONE',
}

export enum OutputType {
    ENROLLMENT = 'ENROLLMENT',
    EVENT = 'EVENT',
    TRACKED_ENTITY_INSTANCE = 'TRACKED_ENTITY_INSTANCE',
}

export enum EventChartLegendDisplayStrategy {
    BY_DATA_ITEM = 'BY_DATA_ITEM',
    FIXED = 'FIXED',
}

export enum DigitGroupSeparator {
    COMMA = 'COMMA',
    NONE = 'NONE',
    SPACE = 'SPACE',
}

export enum UserOrgUnitType {
    DATA_CAPTURE = 'DATA_CAPTURE',
    DATA_OUTPUT = 'DATA_OUTPUT',
    TEI_SEARCH = 'TEI_SEARCH',
}

export enum EventRepetitionParent {
    COLUMN = 'COLUMN',
    FILTER = 'FILTER',
    ROW = 'ROW',
}

export enum DisplayDensity {
    COMFORTABLE = 'COMFORTABLE',
    COMPACT = 'COMPACT',
    NONE = 'NONE',
    NORMAL = 'NORMAL',
}

export enum DataType {
    AGGREGATED_VALUES = 'AGGREGATED_VALUES',
    EVENTS = 'EVENTS',
}

export enum FontSize {
    LARGE = 'LARGE',
    NORMAL = 'NORMAL',
    SMALL = 'SMALL',
}

export enum MissingValueStrategy {
    NEVER_SKIP = 'NEVER_SKIP',
    SKIP_IF_ALL_VALUES_MISSING = 'SKIP_IF_ALL_VALUES_MISSING',
    SKIP_IF_ANY_VALUE_MISSING = 'SKIP_IF_ANY_VALUE_MISSING',
}

export enum ExternalMapLayerImageFormat {
    JPG = 'JPG',
    PNG = 'PNG',
}

export enum ExternalMapLayerMapService {
    TMS = 'TMS',
    VECTOR_STYLE = 'VECTOR_STYLE',
    WMS = 'WMS',
    XYZ = 'XYZ',
}

export enum ExternalMapLayerMapLayerPosition {
    BASEMAP = 'BASEMAP',
    OVERLAY = 'OVERLAY',
}

export enum FileResourceStorageStatus {
    FAILED = 'FAILED',
    NONE = 'NONE',
    PENDING = 'PENDING',
    STORED = 'STORED',
}

export enum FileResourceDomain {
    DATA_VALUE = 'DATA_VALUE',
    DOCUMENT = 'DOCUMENT',
    MESSAGE_ATTACHMENT = 'MESSAGE_ATTACHMENT',
    ORG_UNIT = 'ORG_UNIT',
    PUSH_ANALYSIS = 'PUSH_ANALYSIS',
    USER_AVATAR = 'USER_AVATAR',
}

export enum InterpretationType {
    DATASET_REPORT = 'DATASET_REPORT',
    EVENT_CHART = 'EVENT_CHART',
    EVENT_REPORT = 'EVENT_REPORT',
    EVENT_VISUALIZATION = 'EVENT_VISUALIZATION',
    MAP = 'MAP',
    VISUALIZATION = 'VISUALIZATION',
}

export enum ItemConfigInsertPosition {
    END = 'END',
    START = 'START',
}

export enum JobConfigurationJobStatus {
    COMPLETED = 'COMPLETED',
    DISABLED = 'DISABLED',
    FAILED = 'FAILED',
    NOT_STARTED = 'NOT_STARTED',
    RUNNING = 'RUNNING',
    SCHEDULED = 'SCHEDULED',
    STOPPED = 'STOPPED',
}

export enum JobConfigurationJobType {
    ACCOUNT_EXPIRY_ALERT = 'ACCOUNT_EXPIRY_ALERT',
    AGGREGATE_DATA_EXCHANGE = 'AGGREGATE_DATA_EXCHANGE',
    ANALYTICSTABLE_UPDATE = 'ANALYTICSTABLE_UPDATE',
    ANALYTICS_TABLE = 'ANALYTICS_TABLE',
    COMPLETE_DATA_SET_REGISTRATION_IMPORT = 'COMPLETE_DATA_SET_REGISTRATION_IMPORT',
    CONTINUOUS_ANALYTICS_TABLE = 'CONTINUOUS_ANALYTICS_TABLE',
    CREDENTIALS_EXPIRY_ALERT = 'CREDENTIALS_EXPIRY_ALERT',
    DATAVALUE_IMPORT = 'DATAVALUE_IMPORT',
    DATAVALUE_IMPORT_INTERNAL = 'DATAVALUE_IMPORT_INTERNAL',
    DATA_INTEGRITY = 'DATA_INTEGRITY',
    DATA_SET_NOTIFICATION = 'DATA_SET_NOTIFICATION',
    DATA_STATISTICS = 'DATA_STATISTICS',
    DATA_SYNC = 'DATA_SYNC',
    DISABLE_INACTIVE_USERS = 'DISABLE_INACTIVE_USERS',
    ENROLLMENT_IMPORT = 'ENROLLMENT_IMPORT',
    EVENT_IMPORT = 'EVENT_IMPORT',
    EVENT_PROGRAMS_DATA_SYNC = 'EVENT_PROGRAMS_DATA_SYNC',
    FILE_RESOURCE_CLEANUP = 'FILE_RESOURCE_CLEANUP',
    GEOJSON_IMPORT = 'GEOJSON_IMPORT',
    GML_IMPORT = 'GML_IMPORT',
    IMAGE_PROCESSING = 'IMAGE_PROCESSING',
    LEADER_ELECTION = 'LEADER_ELECTION',
    LEADER_RENEWAL = 'LEADER_RENEWAL',
    MATERIALIZED_SQL_VIEW_UPDATE = 'MATERIALIZED_SQL_VIEW_UPDATE',
    METADATA_IMPORT = 'METADATA_IMPORT',
    META_DATA_SYNC = 'META_DATA_SYNC',
    MOCK = 'MOCK',
    MONITORING = 'MONITORING',
    PREDICTOR = 'PREDICTOR',
    PROGRAM_DATA_SYNC = 'PROGRAM_DATA_SYNC',
    PROGRAM_NOTIFICATIONS = 'PROGRAM_NOTIFICATIONS',
    PUSH_ANALYSIS = 'PUSH_ANALYSIS',
    REMOVE_USED_OR_EXPIRED_RESERVED_VALUES = 'REMOVE_USED_OR_EXPIRED_RESERVED_VALUES',
    RESOURCE_TABLE = 'RESOURCE_TABLE',
    SEND_SCHEDULED_MESSAGE = 'SEND_SCHEDULED_MESSAGE',
    SMS_SEND = 'SMS_SEND',
    SYSTEM_VERSION_UPDATE_CHECK = 'SYSTEM_VERSION_UPDATE_CHECK',
    TEI_IMPORT = 'TEI_IMPORT',
    TEST = 'TEST',
    TRACKER_IMPORT_JOB = 'TRACKER_IMPORT_JOB',
    TRACKER_IMPORT_NOTIFICATION_JOB = 'TRACKER_IMPORT_NOTIFICATION_JOB',
    TRACKER_IMPORT_RULE_ENGINE_JOB = 'TRACKER_IMPORT_RULE_ENGINE_JOB',
    TRACKER_PROGRAMS_DATA_SYNC = 'TRACKER_PROGRAMS_DATA_SYNC',
    TRACKER_SEARCH_OPTIMIZATION = 'TRACKER_SEARCH_OPTIMIZATION',
    VALIDATION_RESULTS_NOTIFICATION = 'VALIDATION_RESULTS_NOTIFICATION',
}

export enum JobConfigurationSchedulingType {
    CRON = 'CRON',
    FIXED_DELAY = 'FIXED_DELAY',
}

export enum JobConfigurationLastExecutedStatus {
    COMPLETED = 'COMPLETED',
    DISABLED = 'DISABLED',
    FAILED = 'FAILED',
    NOT_STARTED = 'NOT_STARTED',
    RUNNING = 'RUNNING',
    SCHEDULED = 'SCHEDULED',
    STOPPED = 'STOPPED',
}

export enum LegendDefinitionsStyle {
    FILL = 'FILL',
    TEXT = 'TEXT',
}

export enum LegendDefinitionsStrategy {
    BY_DATA_ITEM = 'BY_DATA_ITEM',
    FIXED = 'FIXED',
}

export enum MapViewOrganisationUnitSelectionMode {
    ACCESSIBLE = 'ACCESSIBLE',
    ALL = 'ALL',
    CAPTURE = 'CAPTURE',
    CHILDREN = 'CHILDREN',
    DESCENDANTS = 'DESCENDANTS',
    SELECTED = 'SELECTED',
}

export enum MapViewRenderingStrategy {
    SINGLE = 'SINGLE',
    SPLIT_BY_PERIOD = 'SPLIT_BY_PERIOD',
    TIMELINE = 'TIMELINE',
}

export enum MapViewEventStatus {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    OVERDUE = 'OVERDUE',
    SCHEDULE = 'SCHEDULE',
    SKIPPED = 'SKIPPED',
}

export enum MapViewThematicMapType {
    BUBBLE = 'BUBBLE',
    CHOROPLETH = 'CHOROPLETH',
}

export enum MessageConversationMessageType {
    PRIVATE = 'PRIVATE',
    SYSTEM = 'SYSTEM',
    SYSTEM_VERSION_UPDATE = 'SYSTEM_VERSION_UPDATE',
    TICKET = 'TICKET',
    VALIDATION_RESULT = 'VALIDATION_RESULT',
}

export enum MessageConversationPriority {
    HIGH = 'HIGH',
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    NONE = 'NONE',
}

export enum MessageConversationStatus {
    INVALID = 'INVALID',
    NONE = 'NONE',
    OPEN = 'OPEN',
    PENDING = 'PENDING',
    SOLVED = 'SOLVED',
}

export enum MetadataProposalType {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
    UPDATE = 'UPDATE',
}

export enum MetadataProposalTarget {
    ORGANISATION_UNIT = 'ORGANISATION_UNIT',
}

export enum MetadataProposalStatus {
    ACCEPTED = 'ACCEPTED',
    NEEDS_UPDATE = 'NEEDS_UPDATE',
    PROPOSED = 'PROPOSED',
    REJECTED = 'REJECTED',
}

export enum MetadataVersionType {
    ATOMIC = 'ATOMIC',
    BEST_EFFORT = 'BEST_EFFORT',
}

export enum FeatureType {
    MULTI_POLYGON = 'MULTI_POLYGON',
    NONE = 'NONE',
    POINT = 'POINT',
    POLYGON = 'POLYGON',
    SYMBOL = 'SYMBOL',
}

export enum OutlierAnalysisNormalizationMethod {
    Y_RESIDUALS_LINEAR = 'Y_RESIDUALS_LINEAR',
}

export enum OutlierAnalysisOutlierMethod {
    IQR = 'IQR',
    MODIFIED_Z_SCORE = 'MODIFIED_Z_SCORE',
    STANDARD_Z_SCORE = 'STANDARD_Z_SCORE',
}

export enum PredictorOrganisationUnitDescendants {
    DESCENDANTS = 'DESCENDANTS',
    SELECTED = 'SELECTED',
}

export enum ProgramProgramType {
    WITHOUT_REGISTRATION = 'WITHOUT_REGISTRATION',
    WITH_REGISTRATION = 'WITH_REGISTRATION',
}

export enum ProgramAccessLevel {
    AUDITED = 'AUDITED',
    CLOSED = 'CLOSED',
    OPEN = 'OPEN',
    PROTECTED = 'PROTECTED',
}

export enum ProgramIndicatorAnalyticsType {
    ENROLLMENT = 'ENROLLMENT',
    EVENT = 'EVENT',
}

export enum ProgramInstanceStatus {
    ACTIVE = 'ACTIVE',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
}

export enum ProgramNotificationTemplateNotificationTrigger {
    COMPLETION = 'COMPLETION',
    ENROLLMENT = 'ENROLLMENT',
    PROGRAM_RULE = 'PROGRAM_RULE',
    SCHEDULED_DAYS_DUE_DATE = 'SCHEDULED_DAYS_DUE_DATE',
    SCHEDULED_DAYS_ENROLLMENT_DATE = 'SCHEDULED_DAYS_ENROLLMENT_DATE',
    SCHEDULED_DAYS_INCIDENT_DATE = 'SCHEDULED_DAYS_INCIDENT_DATE',
}

export enum ProgramNotificationTemplateNotificationRecipient {
    DATA_ELEMENT = 'DATA_ELEMENT',
    ORGANISATION_UNIT_CONTACT = 'ORGANISATION_UNIT_CONTACT',
    PROGRAM_ATTRIBUTE = 'PROGRAM_ATTRIBUTE',
    TRACKED_ENTITY_INSTANCE = 'TRACKED_ENTITY_INSTANCE',
    USERS_AT_ORGANISATION_UNIT = 'USERS_AT_ORGANISATION_UNIT',
    USER_GROUP = 'USER_GROUP',
    WEB_HOOK = 'WEB_HOOK',
}

export enum ProgramRuleActionProgramRuleActionType {
    ASSIGN = 'ASSIGN',
    CREATEEVENT = 'CREATEEVENT',
    DISPLAYKEYVALUEPAIR = 'DISPLAYKEYVALUEPAIR',
    DISPLAYTEXT = 'DISPLAYTEXT',
    ERRORONCOMPLETE = 'ERRORONCOMPLETE',
    HIDEFIELD = 'HIDEFIELD',
    HIDEOPTION = 'HIDEOPTION',
    HIDEOPTIONGROUP = 'HIDEOPTIONGROUP',
    HIDEPROGRAMSTAGE = 'HIDEPROGRAMSTAGE',
    HIDESECTION = 'HIDESECTION',
    SCHEDULEMESSAGE = 'SCHEDULEMESSAGE',
    SENDMESSAGE = 'SENDMESSAGE',
    SETMANDATORYFIELD = 'SETMANDATORYFIELD',
    SHOWERROR = 'SHOWERROR',
    SHOWOPTIONGROUP = 'SHOWOPTIONGROUP',
    SHOWWARNING = 'SHOWWARNING',
    WARNINGONCOMPLETE = 'WARNINGONCOMPLETE',
}

export enum ProgramRuleActionEvaluationTime {
    ALWAYS = 'ALWAYS',
    ON_COMPLETE = 'ON_COMPLETE',
    ON_DATA_ENTRY = 'ON_DATA_ENTRY',
}

export enum ProgramRuleVariableProgramRuleVariableSourceType {
    CALCULATED_VALUE = 'CALCULATED_VALUE',
    DATAELEMENT_CURRENT_EVENT = 'DATAELEMENT_CURRENT_EVENT',
    DATAELEMENT_NEWEST_EVENT_PROGRAM = 'DATAELEMENT_NEWEST_EVENT_PROGRAM',
    DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE = 'DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE',
    DATAELEMENT_PREVIOUS_EVENT = 'DATAELEMENT_PREVIOUS_EVENT',
    TEI_ATTRIBUTE = 'TEI_ATTRIBUTE',
}

export enum ProgramStageValidationStrategy {
    ON_COMPLETE = 'ON_COMPLETE',
    ON_UPDATE_AND_INSERT = 'ON_UPDATE_AND_INSERT',
}

export enum ProgramStageInstanceStatus {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    OVERDUE = 'OVERDUE',
    SCHEDULE = 'SCHEDULE',
    SKIPPED = 'SKIPPED',
    VISITED = 'VISITED',
}

export enum RelationshipConstraintRelationshipEntity {
    PROGRAM_INSTANCE = 'PROGRAM_INSTANCE',
    PROGRAM_STAGE_INSTANCE = 'PROGRAM_STAGE_INSTANCE',
    TRACKED_ENTITY_INSTANCE = 'TRACKED_ENTITY_INSTANCE',
}

export enum ReportType {
    HTML = 'HTML',
    JASPER_JDBC = 'JASPER_JDBC',
    JASPER_REPORT_TABLE = 'JASPER_REPORT_TABLE',
}

export enum CacheStrategy {
    CACHE_10_MINUTES = 'CACHE_10_MINUTES',
    CACHE_15_MINUTES = 'CACHE_15_MINUTES',
    CACHE_1_HOUR = 'CACHE_1_HOUR',
    CACHE_1_MINUTE = 'CACHE_1_MINUTE',
    CACHE_30_MINUTES = 'CACHE_30_MINUTES',
    CACHE_5_MINUTES = 'CACHE_5_MINUTES',
    CACHE_6AM_TOMORROW = 'CACHE_6AM_TOMORROW',
    CACHE_TWO_WEEKS = 'CACHE_TWO_WEEKS',
    NO_CACHE = 'NO_CACHE',
    RESPECT_SYSTEM_SETTING = 'RESPECT_SYSTEM_SETTING',
}

export enum ReportingRateMetric {
    ACTUAL_REPORTS = 'ACTUAL_REPORTS',
    ACTUAL_REPORTS_ON_TIME = 'ACTUAL_REPORTS_ON_TIME',
    EXPECTED_REPORTS = 'EXPECTED_REPORTS',
    REPORTING_RATE = 'REPORTING_RATE',
    REPORTING_RATE_ON_TIME = 'REPORTING_RATE_ON_TIME',
}

export enum SMSCommandCompletenessMethod {
    ALL_DATAVALUE = 'ALL_DATAVALUE',
    AT_LEAST_ONE_DATAVALUE = 'AT_LEAST_ONE_DATAVALUE',
    DO_NOT_MARK_COMPLETE = 'DO_NOT_MARK_COMPLETE',
}

export enum SMSCommandParserType {
    ALERT_PARSER = 'ALERT_PARSER',
    EVENT_REGISTRATION_PARSER = 'EVENT_REGISTRATION_PARSER',
    J2ME_PARSER = 'J2ME_PARSER',
    KEY_VALUE_PARSER = 'KEY_VALUE_PARSER',
    PROGRAM_STAGE_DATAENTRY_PARSER = 'PROGRAM_STAGE_DATAENTRY_PARSER',
    TRACKED_ENTITY_REGISTRATION_PARSER = 'TRACKED_ENTITY_REGISTRATION_PARSER',
    UNREGISTERED_PARSER = 'UNREGISTERED_PARSER',
}

export enum SqlViewType {
    MATERIALIZED_VIEW = 'MATERIALIZED_VIEW',
    QUERY = 'QUERY',
    VIEW = 'VIEW',
}

export enum TrackedEntityInstanceFilterEnrollmentStatus {
    ACTIVE = 'ACTIVE',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
}

export enum ValidationRuleImportance {
    HIGH = 'HIGH',
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
}

export enum ValidationRuleOperator {
    compulsory_pair = 'compulsory_pair',
    equal_to = 'equal_to',
    exclusive_pair = 'exclusive_pair',
    greater_than = 'greater_than',
    greater_than_or_equal_to = 'greater_than_or_equal_to',
    less_than = 'less_than',
    less_than_or_equal_to = 'less_than_or_equal_to',
    not_equal_to = 'not_equal_to',
}

export enum VisualizationType {
    AREA = 'AREA',
    BAR = 'BAR',
    BUBBLE = 'BUBBLE',
    COLUMN = 'COLUMN',
    GAUGE = 'GAUGE',
    LINE = 'LINE',
    PIE = 'PIE',
    PIVOT_TABLE = 'PIVOT_TABLE',
    RADAR = 'RADAR',
    SCATTER = 'SCATTER',
    SINGLE_VALUE = 'SINGLE_VALUE',
    STACKED_AREA = 'STACKED_AREA',
    STACKED_BAR = 'STACKED_BAR',
    STACKED_COLUMN = 'STACKED_COLUMN',
    YEAR_OVER_YEAR_COLUMN = 'YEAR_OVER_YEAR_COLUMN',
    YEAR_OVER_YEAR_LINE = 'YEAR_OVER_YEAR_LINE',
}

export enum VisualizationNumberType {
    COLUMN_PERCENTAGE = 'COLUMN_PERCENTAGE',
    ROW_PERCENTAGE = 'ROW_PERCENTAGE',
    VALUE = 'VALUE',
}

export type Model =
    | AggregateDataExchange
    | AnalyticsPeriodBoundary
    | AnalyticsTableHook
    | ApiToken
    | Attribute
    | AttributeValue
    | Axis
    | Category
    | CategoryCombo
    | CategoryDimension
    | CategoryOption
    | CategoryOptionCombo
    | CategoryOptionGroup
    | CategoryOptionGroupSet
    | CategoryOptionGroupSetDimension
    | Constant
    | Dashboard
    | DashboardItem
    | DataApprovalLevel
    | DataApprovalWorkflow
    | DataElement
    | DataElementGroup
    | DataElementGroupSet
    | DataElementGroupSetDimension
    | DataElementOperand
    | DataEntryForm
    | DataInputPeriod
    | DataSet
    | DataSetElement
    | DataSetNotificationTemplate
    | DatastoreEntry
    | Document
    | EventChart
    | EventHook
    | EventRepetition
    | EventReport
    | EventVisualization
    | Expression
    | ExpressionDimensionItem
    | ExternalFileResource
    | ExternalMapLayer
    | FileResource
    | Icon
    | Indicator
    | IndicatorGroup
    | IndicatorGroupSet
    | IndicatorType
    | Interpretation
    | InterpretationComment
    | ItemConfig
    | JobConfiguration
    | Legend
    | LegendDefinitions
    | LegendSet
    | Map
    | MapView
    | MessageConversation
    | MetadataProposal
    | MetadataVersion
    | MinMaxDataElement
    | OAuth2Client
    | ObjectStyle
    | Option
    | OptionGroup
    | OptionGroupSet
    | OptionSet
    | OrganisationUnit
    | OrganisationUnitGroup
    | OrganisationUnitGroupSet
    | OrganisationUnitGroupSetDimension
    | OrganisationUnitLevel
    | OutlierAnalysis
    | Predictor
    | PredictorGroup
    | Program
    | ProgramDataElementDimensionItem
    | ProgramIndicator
    | ProgramIndicatorGroup
    | ProgramInstance
    | ProgramNotificationTemplate
    | ProgramRule
    | ProgramRuleAction
    | ProgramRuleVariable
    | ProgramSection
    | ProgramStage
    | ProgramStageDataElement
    | ProgramStageInstance
    | ProgramStageInstanceFilter
    | ProgramStageSection
    | ProgramStageWorkingList
    | ProgramTrackedEntityAttribute
    | ProgramTrackedEntityAttributeDimensionItem
    | PushAnalysis
    | Relationship
    | RelationshipConstraint
    | RelationshipItem
    | RelationshipType
    | Report
    | ReportingRate
    | Route
    | SMSCommand
    | Section
    | SeriesKey
    | Sharing
    | SqlView
    | TrackedEntityAttribute
    | TrackedEntityAttributeValue
    | TrackedEntityDataElementDimension
    | TrackedEntityInstance
    | TrackedEntityInstanceFilter
    | TrackedEntityProgramIndicatorDimension
    | TrackedEntityType
    | TrackedEntityTypeAttribute
    | User
    | UserAccess
    | UserCredentialsDto
    | UserGroup
    | UserGroupAccess
    | UserRole
    | ValidationNotificationTemplate
    | ValidationResult
    | ValidationRule
    | ValidationRuleGroup
    | Visualization
