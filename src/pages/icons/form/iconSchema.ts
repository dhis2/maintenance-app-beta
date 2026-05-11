import { z } from 'zod'
import { createFormValidate } from '../../../lib'

export type IconModel = {
    key: string
    description: string
    href: string
    custom: boolean
    keywords?: string[]
    lastUpdated?: string
    created?: string
    createdBy?: { displayName: string; id: string }
}

export const iconNewFormSchema = z.object({
    key: z.string().min(1),
    description: z.string().optional(),
    keywords: z.string().optional(),
    fileResourceId: z.string().min(1),
})

export const iconEditFormSchema = z.object({
    description: z.string().optional(),
    keywords: z.string().optional(),
})

export type IconNewFormValues = z.input<typeof iconNewFormSchema>
export type IconEditFormValues = z.input<typeof iconEditFormSchema>

export const newInitialValues: IconNewFormValues = {
    key: '',
    description: '',
    keywords: '',
    fileResourceId: '',
}

export const editInitialValues: IconEditFormValues = {
    description: '',
    keywords: '',
}

export const validateNew = createFormValidate(iconNewFormSchema)
export const validateEdit = createFormValidate(iconEditFormSchema)

export const keywordsToString = (keywords?: string[]) =>
    keywords?.join(', ') ?? ''

export const stringToKeywords = (keywords?: string) =>
    keywords
        ?.split(',')
        .map((k) => k.trim())
        .filter(Boolean) ?? []
