import { BaseIdentifiableObject } from '../../types/generated'

export const DEFAULT_FIELD_FILTERS = ['id', 'access', 'displayName'] as const
export const ATTRIBUTE_VALUES_FIELD_FILTERS = [
    'attributeValues[value,attribute[id]]',
] as const

export type DefaultFields = (typeof DEFAULT_FIELD_FILTERS)[number]

export type BaseListModel = Pick<BaseIdentifiableObject, DefaultFields>
