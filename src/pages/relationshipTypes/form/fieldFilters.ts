import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    DEFAULT_FIELD_FILTERS,
} from '../../../lib'

export const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'code',
    'description',
    'bidirectional',
    'fromToName',
    'toFromName',
    'fromConstraint[relationshipEntity,trackedEntityType[id,displayName,name,trackedEntityTypeAttributes[trackedEntityAttribute[id,displayName]]],program[id,displayName,programType,trackedEntityType,programTrackedEntityAttributes[id,trackedEntityAttribute[id,displayName,valueType]]],programStage[id,displayName,programStageDataElements[dataElement[id,displayName]]],trackerDataView[attributes,dataElements]]',
    'toConstraint[relationshipEntity,trackedEntityType[id,displayName,name,trackedEntityTypeAttributes[trackedEntityAttribute[id,displayName]]],program[id,displayName,programType,trackedEntityType,programTrackedEntityAttributes[id,trackedEntityAttribute[id,displayName,valueType]]],programStage[id,displayName,programStageDataElements[dataElement[id,displayName]]],trackerDataView[attributes,dataElements]]',
] as const
