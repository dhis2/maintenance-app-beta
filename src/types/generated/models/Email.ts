/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { User } from './User'

export type Email = {
    recipients: Array<User>
    sender: User
    subject: string
    text: string
}
