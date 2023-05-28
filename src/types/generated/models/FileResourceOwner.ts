/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type FileResourceOwner = {
    co: string
    de: string
    domain: FileResourceOwner.domain
    id: string
    ou: string
    pe: string
}

export namespace FileResourceOwner {
    export enum domain {
        DATA_VALUE = 'DATA_VALUE',
        PUSH_ANALYSIS = 'PUSH_ANALYSIS',
        DOCUMENT = 'DOCUMENT',
        MESSAGE_ATTACHMENT = 'MESSAGE_ATTACHMENT',
        USER_AVATAR = 'USER_AVATAR',
        ORG_UNIT = 'ORG_UNIT',
        CUSTOM_ICON = 'CUSTOM_ICON',
    }
}
