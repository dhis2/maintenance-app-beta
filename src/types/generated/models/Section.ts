/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { DataElementOperand } from './DataElementOperand'
import type { CategoryCombo } from './CategoryCombo'
import type { DataElement } from './DataElement'
import type { DataSet } from './DataSet'
import type { Indicator } from './Indicator'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type Section = {
    access: Access
    attributeValues: Array<AttributeValue>
    categoryCombos: Array<CategoryCombo>
    code: string
    created: string
    createdBy: User
    dataElements: Array<DataElement>
    dataSet: DataSet
    description: string
    disableDataElementAutoGroup: boolean
    displayName: string
    favorite: boolean
    favorites: Array<string>
    greyedFields: Array<DataElementOperand>
    href: string
    id: string
    indicators: Array<Indicator>
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    sharing: Sharing
    showColumnTotals: boolean
    showRowTotals: boolean
    sortOrder: number
    translations: Array<Translation>
    user: User
}
