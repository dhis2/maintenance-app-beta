/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AccessData } from './AccessData'

export type Access = {
    data: AccessData
    delete: boolean
    externalize: boolean
    manage: boolean
    read: boolean
    update: boolean
    write: boolean
}
