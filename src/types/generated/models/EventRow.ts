/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Dxf2DeprecatedTrackerEvent_DataValue } from './Dxf2DeprecatedTrackerEvent_DataValue'
import type { Dxf2DeprecatedTrackerTrackedentity_Attribute } from './Dxf2DeprecatedTrackerTrackedentity_Attribute'
import type { Note } from './Note'

export type EventRow = {
    attributeCategoryOptions: string
    attributes: Array<Dxf2DeprecatedTrackerTrackedentity_Attribute>
    dataValues: Array<Dxf2DeprecatedTrackerEvent_DataValue>
    deleted: boolean
    dueDate: string
    enrollment: string
    event: string
    eventDate: string
    followup: boolean
    href: string
    notes: Array<Note>
    orgUnit: string
    orgUnitName: string
    program: string
    programStage: string
    trackedEntityInstance: string
    trackedEntityInstanceCreated: string
    trackedEntityInstanceInactive: boolean
    trackedEntityInstanceOrgUnit: string
    trackedEntityInstanceOrgUnitName: string
}
