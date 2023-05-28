/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AggregateDataExchangeJobParameters } from './AggregateDataExchangeJobParameters'
import type { AnalyticsJobParameters } from './AnalyticsJobParameters'
import type { AttributeValue } from './AttributeValue'
import type { ContinuousAnalyticsJobParameters } from './ContinuousAnalyticsJobParameters'
import type { DataIntegrityJobParameters } from './DataIntegrityJobParameters'
import type { DataSynchronizationJobParameters } from './DataSynchronizationJobParameters'
import type { DisableInactiveUsersJobParameters } from './DisableInactiveUsersJobParameters'
import type { EventProgramsDataSynchronizationJobParameters } from './EventProgramsDataSynchronizationJobParameters'
import type { MetadataSyncJobParameters } from './MetadataSyncJobParameters'
import type { MonitoringJobParameters } from './MonitoringJobParameters'
import type { PredictorJobParameters } from './PredictorJobParameters'
import type { PushAnalysisJobParameters } from './PushAnalysisJobParameters'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { SmsJobParameters } from './SmsJobParameters'
import type { SqlViewUpdateParameters } from './SqlViewUpdateParameters'
import type { TestJobParameters } from './TestJobParameters'
import type { TrackerProgramsDataSynchronizationJobParameters } from './TrackerProgramsDataSynchronizationJobParameters'
import type { TrackerTrigramIndexJobParameters } from './TrackerTrigramIndexJobParameters'
import type { Translation } from './Translation'

export type JobConfiguration = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    configurable: boolean
    created: string
    createdBy: User
    cronExpression: string
    delay: number
    displayName: string
    enabled: boolean
    executedBy: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    jobParameters:
        | AnalyticsJobParameters
        | ContinuousAnalyticsJobParameters
        | MonitoringJobParameters
        | PredictorJobParameters
        | PushAnalysisJobParameters
        | SmsJobParameters
        | MetadataSyncJobParameters
        | EventProgramsDataSynchronizationJobParameters
        | TrackerProgramsDataSynchronizationJobParameters
        | DataSynchronizationJobParameters
        | DisableInactiveUsersJobParameters
        | TrackerTrigramIndexJobParameters
        | DataIntegrityJobParameters
        | AggregateDataExchangeJobParameters
        | SqlViewUpdateParameters
        | TestJobParameters
    jobStatus: JobConfiguration.jobStatus
    jobType: JobConfiguration.jobType
    lastExecuted: string
    lastExecutedStatus: JobConfiguration.lastExecutedStatus
    lastRuntimeExecution: string
    lastUpdated: string
    lastUpdatedBy: User
    leaderOnlyJob: boolean
    name: string
    nextExecutionTime: string
    schedulingType: JobConfiguration.schedulingType
    sharing: Sharing
    translations: Array<Translation>
    user: User
    userUid: string
}

export namespace JobConfiguration {
    export enum jobStatus {
        RUNNING = 'RUNNING',
        COMPLETED = 'COMPLETED',
        STOPPED = 'STOPPED',
        SCHEDULED = 'SCHEDULED',
        DISABLED = 'DISABLED',
        FAILED = 'FAILED',
        NOT_STARTED = 'NOT_STARTED',
    }

    export enum jobType {
        DATA_STATISTICS = 'DATA_STATISTICS',
        DATA_INTEGRITY = 'DATA_INTEGRITY',
        RESOURCE_TABLE = 'RESOURCE_TABLE',
        ANALYTICS_TABLE = 'ANALYTICS_TABLE',
        CONTINUOUS_ANALYTICS_TABLE = 'CONTINUOUS_ANALYTICS_TABLE',
        DATA_SYNC = 'DATA_SYNC',
        TRACKER_PROGRAMS_DATA_SYNC = 'TRACKER_PROGRAMS_DATA_SYNC',
        EVENT_PROGRAMS_DATA_SYNC = 'EVENT_PROGRAMS_DATA_SYNC',
        FILE_RESOURCE_CLEANUP = 'FILE_RESOURCE_CLEANUP',
        IMAGE_PROCESSING = 'IMAGE_PROCESSING',
        META_DATA_SYNC = 'META_DATA_SYNC',
        AGGREGATE_DATA_EXCHANGE = 'AGGREGATE_DATA_EXCHANGE',
        SMS_SEND = 'SMS_SEND',
        SEND_SCHEDULED_MESSAGE = 'SEND_SCHEDULED_MESSAGE',
        PROGRAM_NOTIFICATIONS = 'PROGRAM_NOTIFICATIONS',
        VALIDATION_RESULTS_NOTIFICATION = 'VALIDATION_RESULTS_NOTIFICATION',
        CREDENTIALS_EXPIRY_ALERT = 'CREDENTIALS_EXPIRY_ALERT',
        MONITORING = 'MONITORING',
        PUSH_ANALYSIS = 'PUSH_ANALYSIS',
        TRACKER_SEARCH_OPTIMIZATION = 'TRACKER_SEARCH_OPTIMIZATION',
        PREDICTOR = 'PREDICTOR',
        DATA_SET_NOTIFICATION = 'DATA_SET_NOTIFICATION',
        REMOVE_USED_OR_EXPIRED_RESERVED_VALUES = 'REMOVE_USED_OR_EXPIRED_RESERVED_VALUES',
        TRACKER_IMPORT_JOB = 'TRACKER_IMPORT_JOB',
        TRACKER_IMPORT_NOTIFICATION_JOB = 'TRACKER_IMPORT_NOTIFICATION_JOB',
        TRACKER_IMPORT_RULE_ENGINE_JOB = 'TRACKER_IMPORT_RULE_ENGINE_JOB',
        MATERIALIZED_SQL_VIEW_UPDATE = 'MATERIALIZED_SQL_VIEW_UPDATE',
        LOCK_EXCEPTION_CLEANUP = 'LOCK_EXCEPTION_CLEANUP',
        LEADER_ELECTION = 'LEADER_ELECTION',
        LEADER_RENEWAL = 'LEADER_RENEWAL',
        COMPLETE_DATA_SET_REGISTRATION_IMPORT = 'COMPLETE_DATA_SET_REGISTRATION_IMPORT',
        DATAVALUE_IMPORT_INTERNAL = 'DATAVALUE_IMPORT_INTERNAL',
        METADATA_IMPORT = 'METADATA_IMPORT',
        DATAVALUE_IMPORT = 'DATAVALUE_IMPORT',
        GEOJSON_IMPORT = 'GEOJSON_IMPORT',
        EVENT_IMPORT = 'EVENT_IMPORT',
        ENROLLMENT_IMPORT = 'ENROLLMENT_IMPORT',
        TEI_IMPORT = 'TEI_IMPORT',
        DISABLE_INACTIVE_USERS = 'DISABLE_INACTIVE_USERS',
        ACCOUNT_EXPIRY_ALERT = 'ACCOUNT_EXPIRY_ALERT',
        SYSTEM_VERSION_UPDATE_CHECK = 'SYSTEM_VERSION_UPDATE_CHECK',
        TEST = 'TEST',
        MOCK = 'MOCK',
        GML_IMPORT = 'GML_IMPORT',
        ANALYTICSTABLE_UPDATE = 'ANALYTICSTABLE_UPDATE',
        PROGRAM_DATA_SYNC = 'PROGRAM_DATA_SYNC',
    }

    export enum lastExecutedStatus {
        RUNNING = 'RUNNING',
        COMPLETED = 'COMPLETED',
        STOPPED = 'STOPPED',
        SCHEDULED = 'SCHEDULED',
        DISABLED = 'DISABLED',
        FAILED = 'FAILED',
        NOT_STARTED = 'NOT_STARTED',
    }

    export enum schedulingType {
        CRON = 'CRON',
        FIXED_DELAY = 'FIXED_DELAY',
    }
}
