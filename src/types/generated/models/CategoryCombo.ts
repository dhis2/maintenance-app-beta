/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { Category } from './Category'
import type { CategoryOptionCombo } from './CategoryOptionCombo'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type CategoryCombo = {
    access: Access
    attributeValues: Array<AttributeValue>
    categories: Array<Category>
    categoryOptionCombos: Array<CategoryOptionCombo>
    code: string
    created: string
    createdBy: User
    dataDimensionType: CategoryCombo.dataDimensionType
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    isDefault: boolean
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    sharing: Sharing
    skipTotal: boolean
    translations: Array<Translation>
    user: User
}

export namespace CategoryCombo {
    export enum dataDimensionType {
        DISAGGREGATION = 'DISAGGREGATION',
        ATTRIBUTE = 'ATTRIBUTE',
    }
}
