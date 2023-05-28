/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UserSettings = {
    analysisDisplayProperty: UserSettings.analysisDisplayProperty
    dbLocale: string
    messageEmailNotification: boolean
    messageSmsNotification: boolean
    style: string
    trackerDashboardLayout: string
    uiLocale: string
}

export namespace UserSettings {
    export enum analysisDisplayProperty {
        NAME = 'NAME',
        SHORTNAME = 'SHORTNAME',
    }
}
