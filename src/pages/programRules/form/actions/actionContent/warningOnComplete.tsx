import { messageActionFields } from './common/messageAction'

export const warningOnComplete = (programId: string) =>
    messageActionFields(programId, true)
