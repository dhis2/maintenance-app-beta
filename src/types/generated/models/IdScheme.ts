/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type IdScheme = {
    attribute: string
    identifiableProperty: IdScheme.identifiableProperty
    identifiableString: string
    notNull: boolean
    null: boolean
}

export namespace IdScheme {
    export enum identifiableProperty {
        ID = 'ID',
        UID = 'UID',
        UUID = 'UUID',
        NAME = 'NAME',
        CODE = 'CODE',
        ATTRIBUTE = 'ATTRIBUTE',
    }
}
