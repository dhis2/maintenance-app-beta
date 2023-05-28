/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SMPPGatewayConfig = {
    bindType: SMPPGatewayConfig.bindType
    compressed: boolean
    host: string
    id: string
    isDefault: boolean
    maxSmsLength: string
    name: string
    numberPlanIndicator: SMPPGatewayConfig.numberPlanIndicator
    password: string
    port: number
    sendUrlParameters: boolean
    systemId: string
    systemType: string
    typeOfNumber: SMPPGatewayConfig.typeOfNumber
    uid: string
    urlTemplate: string
    username: string
}

export namespace SMPPGatewayConfig {
    export enum bindType {
        BIND_TX = 'BIND_TX',
        BIND_RX = 'BIND_RX',
        BIND_TRX = 'BIND_TRX',
    }

    export enum numberPlanIndicator {
        UNKNOWN = 'UNKNOWN',
        ISDN = 'ISDN',
        DATA = 'DATA',
        TELEX = 'TELEX',
        LAND_MOBILE = 'LAND_MOBILE',
        NATIONAL = 'NATIONAL',
        PRIVATE = 'PRIVATE',
        ERMES = 'ERMES',
        INTERNET = 'INTERNET',
        WAP = 'WAP',
    }

    export enum typeOfNumber {
        UNKNOWN = 'UNKNOWN',
        INTERNATIONAL = 'INTERNATIONAL',
        NATIONAL = 'NATIONAL',
        NETWORK_SPECIFIC = 'NETWORK_SPECIFIC',
        SUBSCRIBER_NUMBER = 'SUBSCRIBER_NUMBER',
        ALPHANUMERIC = 'ALPHANUMERIC',
        ABBREVIATED = 'ABBREVIATED',
    }
}
