/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ApiTokenAuth } from './ApiTokenAuth'
import type { HttpBasicAuth } from './HttpBasicAuth'

export type WebhookTarget = {
    auth: HttpBasicAuth | ApiTokenAuth
    clientId: string
    contentType: string
    headers: Record<string, string>
    type: string
    url: string
}
