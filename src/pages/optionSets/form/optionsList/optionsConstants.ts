import { BaseListModel } from '../../../../lib'

export type Option = { id: string; deleted?: boolean }
export type OptionDetail = BaseListModel & { name: string; code: string }
export type OptionsDetails = Record<string, OptionDetail>

export const MAXIMUM_OPTIONS = 15000
