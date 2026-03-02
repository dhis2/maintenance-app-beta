import { messageActionFields } from './common/messageAction'

export const errorOnComplete = (programId: string) =>
    messageActionFields(programId, false)
