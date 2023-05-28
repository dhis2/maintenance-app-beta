/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type OrgUnitInfo = {
    address: string
    closedDate: string
    code: string
    comment: string
    contactPerson: string
    description: string
    email: string
    featureType: OrgUnitInfo.featureType
    id: string
    imageId: string
    latitude: number
    level: number
    levelName: string
    longitude: number
    name: string
    openingDate: string
    parentName: string
    phoneNumber: string
    shortName: string
    url: string
}

export namespace OrgUnitInfo {
    export enum featureType {
        NONE = 'NONE',
        MULTI_POLYGON = 'MULTI_POLYGON',
        POLYGON = 'POLYGON',
        POINT = 'POINT',
        SYMBOL = 'SYMBOL',
    }
}
