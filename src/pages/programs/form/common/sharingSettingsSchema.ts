import { z } from 'zod'

export const sharingSettingsSchema = z.object({
    owner: z.string().optional(),
    external: z.boolean().optional(),
    public: z.string().optional(),
    userGroups: z
        .record(
            z.object({
                id: z.string(),
                access: z.string(),
                displayName: z.string().optional(),
            })
        )
        .optional(),
    users: z
        .record(
            z.object({
                id: z.string(),
                access: z.string(),
                displayName: z.string().optional(),
            })
        )
        .optional(),
})
