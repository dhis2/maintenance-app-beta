/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type MetadataImportParams = {
    atomicMode: MetadataImportParams.atomicMode
    flushMode: MetadataImportParams.flushMode
    identifier: MetadataImportParams.identifier
    importMode: MetadataImportParams.importMode
    importReportMode: MetadataImportParams.importReportMode
    importStrategy: MetadataImportParams.importStrategy
    mergeMode: MetadataImportParams.mergeMode
    metadataSyncImport: boolean
    preheatMode: MetadataImportParams.preheatMode
    skipSharing: boolean
    skipTranslation: boolean
    skipValidation: boolean
    userOverrideMode: MetadataImportParams.userOverrideMode
}

export namespace MetadataImportParams {
    export enum atomicMode {
        ALL = 'ALL',
        NONE = 'NONE',
    }

    export enum flushMode {
        OBJECT = 'OBJECT',
        AUTO = 'AUTO',
    }

    export enum identifier {
        UID = 'UID',
        CODE = 'CODE',
    }

    export enum importMode {
        COMMIT = 'COMMIT',
        VALIDATE = 'VALIDATE',
    }

    export enum importReportMode {
        FULL = 'FULL',
        ERRORS = 'ERRORS',
        ERRORS_NOT_OWNER = 'ERRORS_NOT_OWNER',
        DEBUG = 'DEBUG',
    }

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

    export enum preheatMode {
        REFERENCE = 'REFERENCE',
        ALL = 'ALL',
        NONE = 'NONE',
    }

    export enum userOverrideMode {
        NONE = 'NONE',
        CURRENT = 'CURRENT',
        SELECTED = 'SELECTED',
    }
}
