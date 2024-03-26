import { BaseIdentifiableObject } from '../../types/generated'

export const DEFAULT_FIELD_FILTERS = ['id', 'access', 'displayName'] as const
export type DefaultFields = (typeof DEFAULT_FIELD_FILTERS)[number]

export type BaseListModel = Pick<BaseIdentifiableObject, DefaultFields>
