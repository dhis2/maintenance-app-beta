/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BulkSmsGatewayConfig } from './BulkSmsGatewayConfig'
import type { ClickatellGatewayConfig } from './ClickatellGatewayConfig'
import type { GenericHttpGatewayConfig } from './GenericHttpGatewayConfig'
import type { SMPPGatewayConfig } from './SMPPGatewayConfig'

export type SmsConfiguration = {
    gateways: Array<
        | BulkSmsGatewayConfig
        | GenericHttpGatewayConfig
        | ClickatellGatewayConfig
        | SMPPGatewayConfig
    >
}
