/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AppActivities } from './AppActivities'
import type { AppDeveloper } from './AppDeveloper'
import type { AppIcons } from './AppIcons'
import type { AppSettings } from './AppSettings'

export type App = {
    activities: AppActivities
    appState: App.appState
    appStorageSource: App.appStorageSource
    appType: App.appType
    app_hub_id: string
    authorities: Array<string>
    baseUrl: string
    bundled: boolean
    core_app: boolean
    default_locale: string
    description: string
    developer: AppDeveloper
    folderName: string
    icons: AppIcons
    installs_allowed_from: Array<string>
    key: string
    launchUrl: string
    launch_path: string
    name: string
    pluginLaunchUrl: string
    plugin_launch_path: string
    plugin_type: string
    settings: AppSettings
    short_name: string
    version: string
}

export namespace App {
    export enum appState {
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

    export enum appStorageSource {
        LOCAL = 'LOCAL',
        JCLOUDS = 'JCLOUDS',
    }

    export enum appType {
        APP = 'APP',
        RESOURCE = 'RESOURCE',
        DASHBOARD_WIDGET = 'DASHBOARD_WIDGET',
        TRACKER_DASHBOARD_WIDGET = 'TRACKER_DASHBOARD_WIDGET',
    }
}
