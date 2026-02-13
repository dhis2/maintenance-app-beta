import { messageActionFields } from './common/messageAction'

export const showError = (programId: string) =>
    messageActionFields(programId, false)
