/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { Predictor } from './Predictor'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type PredictorGroup = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    description: string
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    predictors: Array<Predictor>
    sharing: Sharing
    translations: Array<Translation>
    user: User
}
