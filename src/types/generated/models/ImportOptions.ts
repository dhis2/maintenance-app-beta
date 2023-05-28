/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IdSchemes } from './IdSchemes'

export type ImportOptions = {
    async: boolean
    dataSet: string
    datasetAllowsPeriods: boolean
    dryRun: boolean
    filename: string
    firstRowIsHeader: boolean
    force: boolean
    idSchemes: IdSchemes
    ignoreEmptyCollection: boolean
    importStrategy: ImportOptions.importStrategy
    mergeDataValues: boolean
    mergeMode: ImportOptions.mergeMode
    notificationLevel: ImportOptions.notificationLevel
    preheatCache: boolean
    reportMode: ImportOptions.reportMode
    requireAttributeOptionCombo: boolean
    requireCategoryOptionCombo: boolean
    sharing: boolean
    skipAudit: boolean
    skipCache: boolean
    skipExistingCheck: boolean
    skipLastUpdated: boolean
    skipNotifications: boolean
    skipPatternValidation: boolean
    strictAttributeOptionCombos: boolean
    strictCategoryOptionCombos: boolean
    strictDataElements: boolean
    strictDataSetApproval: boolean
    strictDataSetInputPeriods: boolean
    strictDataSetLocking: boolean
    strictOrganisationUnits: boolean
    strictPeriods: boolean
}

export namespace ImportOptions {
    export enum importStrategy {
        CREATE = 'CREATE',
        UPDATE = 'UPDATE',
        CREATE_AND_UPDATE = 'CREATE_AND_UPDATE',
        DELETE = 'DELETE',
        SYNC = 'SYNC',
        NEW_AND_UPDATES = 'NEW_AND_UPDATES',
        NEW = 'NEW',
        UPDATES = 'UPDATES',
        DELETES = 'DELETES',
    }

    export enum mergeMode {
        MERGE_ALWAYS = 'MERGE_ALWAYS',
        MERGE_IF_NOT_NULL = 'MERGE_IF_NOT_NULL',
        MERGE = 'MERGE',
        REPLACE = 'REPLACE',
        NONE = 'NONE',
    }

    export enum notificationLevel {
        OFF = 'OFF',
        DEBUG = 'DEBUG',
        LOOP = 'LOOP',
        INFO = 'INFO',
        WARN = 'WARN',
        ERROR = 'ERROR',
    }

    export enum reportMode {
        FULL = 'FULL',
        ERRORS = 'ERRORS',
        ERRORS_NOT_OWNER = 'ERRORS_NOT_OWNER',
        DEBUG = 'DEBUG',
    }
}
