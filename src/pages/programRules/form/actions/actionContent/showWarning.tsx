import { messageActionFields } from './common/messageAction'

export const showWarning = (programId: string) =>
    messageActionFields(programId, true)
