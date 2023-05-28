/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { DataSet } from './DataSet'
import type { Program } from './Program'
import type { ProgramStage } from './ProgramStage'
import type { User } from './User'
import type { UserGroup } from './UserGroup'
import type { Sharing } from './Sharing'
import type { SMSCode } from './SMSCode'
import type { SMSSpecialCharacter } from './SMSSpecialCharacter'
import type { Translation } from './Translation'

export type SMSCommand = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    codeValueSeparator: string
    completenessMethod: SMSCommand.completenessMethod
    created: string
    createdBy: User
    currentPeriodUsedForReporting: boolean
    dataset: DataSet
    defaultMessage: string
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    moreThanOneOrgUnitMessage: string
    name: string
    noUserMessage: string
    parserType: SMSCommand.parserType
    program: Program
    programStage: ProgramStage
    receivedMessage: string
    separator: string
    sharing: Sharing
    smsCodes: Array<SMSCode>
    specialCharacters: Array<SMSSpecialCharacter>
    successMessage: string
    translations: Array<Translation>
    user: User
    userGroup: UserGroup
    wrongFormatMessage: string
}

export namespace SMSCommand {
    export enum completenessMethod {
        ALL_DATAVALUE = 'ALL_DATAVALUE',
        AT_LEAST_ONE_DATAVALUE = 'AT_LEAST_ONE_DATAVALUE',
        DO_NOT_MARK_COMPLETE = 'DO_NOT_MARK_COMPLETE',
    }

    export enum parserType {
        KEY_VALUE_PARSER = 'KEY_VALUE_PARSER',
        J2ME_PARSER = 'J2ME_PARSER',
        ALERT_PARSER = 'ALERT_PARSER',
        UNREGISTERED_PARSER = 'UNREGISTERED_PARSER',
        TRACKED_ENTITY_REGISTRATION_PARSER = 'TRACKED_ENTITY_REGISTRATION_PARSER',
        PROGRAM_STAGE_DATAENTRY_PARSER = 'PROGRAM_STAGE_DATAENTRY_PARSER',
        EVENT_REGISTRATION_PARSER = 'EVENT_REGISTRATION_PARSER',
    }
}
