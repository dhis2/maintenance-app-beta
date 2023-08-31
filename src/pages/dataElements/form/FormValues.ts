export type FormValues = {
    name: string
    shortName: string
    code: string
    description: string
    url: string
    color: string
    icon: string
    fieldMask: string
    domainType: string
    formName: string
    valueType: string
    aggregationType: string
    categoryCombo: string // dataElement.categoryCombo?.id,
    optionSet: string // dataElement.optionSet,
    commentOptionSet: string // dataElement.commentOptionSet,
    legendSet: string[] // dataElement.legendSet || [],
    aggregationLevels: string[] // dataElement.aggregationLevels || [],
    attributeValues: {
        [attributeId: string]: string
    }
}
