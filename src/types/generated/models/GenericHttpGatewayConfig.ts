/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GenericGatewayParameter } from './GenericGatewayParameter'

export type GenericHttpGatewayConfig = {
    configurationTemplate: string
    contentType: GenericHttpGatewayConfig.contentType
    id: string
    isDefault: boolean
    maxSmsLength: string
    name: string
    parameters: Array<GenericGatewayParameter>
    password: string
    sendUrlParameters: boolean
    uid: string
    urlTemplate: string
    useGet: boolean
    username: string
}

export namespace GenericHttpGatewayConfig {
    export enum contentType {
        APPLICATION_JSON = 'APPLICATION_JSON',
        APPLICATION_XML = 'APPLICATION_XML',
        TEXT_PLAIN = 'TEXT_PLAIN',
        FORM_URL_ENCODED = 'FORM_URL_ENCODED',
    }
}
