/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type GistPreferences = {
    included: GistPreferences.included
    transformation: GistPreferences.transformation
}

export namespace GistPreferences {
    export enum included {
        FALSE = 'FALSE',
        TRUE = 'TRUE',
        AUTO = 'AUTO',
    }

    export enum transformation {
        AUTO = 'AUTO',
        NONE = 'NONE',
        IS_EMPTY = 'IS_EMPTY',
        IS_NOT_EMPTY = 'IS_NOT_EMPTY',
        SIZE = 'SIZE',
        MEMBER = 'MEMBER',
        NOT_MEMBER = 'NOT_MEMBER',
        IDS = 'IDS',
        ID_OBJECTS = 'ID_OBJECTS',
        PLUCK = 'PLUCK',
        FROM = 'FROM',
    }
}
