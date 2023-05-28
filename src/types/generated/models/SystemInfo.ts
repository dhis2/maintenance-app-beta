/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DatabaseInfo } from './DatabaseInfo'

export type SystemInfo = {
    buildTime: string
    calendar: string
    clusterHostname: string
    contextPath: string
    cpuCores: number
    databaseInfo: DatabaseInfo
    dateFormat: string
    emailConfigured: boolean
    encryption: boolean
    environmentVariable: string
    externalDirectory: string
    fileStoreProvider: string
    instanceBaseUrl: string
    intervalSinceLastAnalyticsTablePartitionSuccess: string
    intervalSinceLastAnalyticsTableSuccess: string
    isMetadataSyncEnabled: boolean
    isMetadataVersionEnabled: boolean
    jasperReportsVersion: string
    javaOpts: string
    javaVendor: string
    javaVersion: string
    lastAnalyticsTablePartitionRuntime: string
    lastAnalyticsTablePartitionSuccess: string
    lastAnalyticsTableRuntime: string
    lastAnalyticsTableSuccess: string
    lastMetadataVersionSyncAttempt: string
    lastSystemMonitoringSuccess: string
    memoryInfo: string
    nodeId: string
    osArchitecture: string
    osName: string
    osVersion: string
    readOnlyMode: string
    readReplicaCount: number
    redisEnabled: boolean
    redisHostname: string
    revision: string
    serverDate: string
    serverTimeZoneDisplayName: string
    serverTimeZoneId: string
    systemId: string
    systemMetadataVersion: string
    systemMonitoringUrl: string
    systemName: string
    userAgent: string
    version: string
}
