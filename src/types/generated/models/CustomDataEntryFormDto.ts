/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CustomDataEntryFormDto = {
    dataSetId: string
    displayDensity: CustomDataEntryFormDto.displayDensity
    form: string
    id: string
    version: number
}

export namespace CustomDataEntryFormDto {
    export enum displayDensity {
        COMFORTABLE = 'COMFORTABLE',
        NORMAL = 'NORMAL',
        COMPACT = 'COMPACT',
        NONE = 'NONE',
    }
}
