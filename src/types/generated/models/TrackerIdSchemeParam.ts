/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TrackerIdSchemeParam = {
    attributeUid: string
    idScheme: TrackerIdSchemeParam.idScheme
}

export namespace TrackerIdSchemeParam {
    export enum idScheme {
        UID = 'UID',
        CODE = 'CODE',
        NAME = 'NAME',
        ATTRIBUTE = 'ATTRIBUTE',
    }
}
