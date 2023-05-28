/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AppVersion } from './AppVersion'
import type { Developer } from './Developer'
import type { ImageResource } from './ImageResource'
import type { Review } from './Review'

export type WebApp = {
    appType: WebApp.appType
    created: string
    description: string
    developer: Developer
    id: string
    images: Array<ImageResource>
    lastUpdated: string
    name: string
    owner: string
    reviews: Array<Review>
    sourceUrl: string
    status: WebApp.status
    versions: Array<AppVersion>
}

export namespace WebApp {
    export enum appType {
        APP = 'APP',
        RESOURCE = 'RESOURCE',
        DASHBOARD_WIDGET = 'DASHBOARD_WIDGET',
        TRACKER_DASHBOARD_WIDGET = 'TRACKER_DASHBOARD_WIDGET',
    }

    export enum status {
        OK = 'OK',
        INVALID_BUNDLED_APP_OVERRIDE = 'INVALID_BUNDLED_APP_OVERRIDE',
        INVALID_CORE_APP = 'INVALID_CORE_APP',
        NAMESPACE_TAKEN = 'NAMESPACE_TAKEN',
        INVALID_ZIP_FORMAT = 'INVALID_ZIP_FORMAT',
        MISSING_MANIFEST = 'MISSING_MANIFEST',
        INVALID_MANIFEST_JSON = 'INVALID_MANIFEST_JSON',
        INSTALLATION_FAILED = 'INSTALLATION_FAILED',
        NOT_FOUND = 'NOT_FOUND',
        MISSING_SYSTEM_BASE_URL = 'MISSING_SYSTEM_BASE_URL',
        APPROVED = 'APPROVED',
        PENDING = 'PENDING',
        NOT_APPROVED = 'NOT_APPROVED',
        DELETION_IN_PROGRESS = 'DELETION_IN_PROGRESS',
    }
}
