import React from 'react'
import { useFormState, withTypes } from 'react-final-form'
import { z } from 'zod'

const downloadSchema = z.object({
    compression: z.enum(['zip', 'gz', 'uncompressed']).default('zip'),
    includeSharing: z.boolean().default(true),
    filter: z.enum(['filters', 'selected', 'all']).default('all'),
})

export type DownloadFormValues = z.infer<typeof downloadSchema>

const { Form } = withTypes<DownloadFormValues>()

export const useDownloadFormState = () =>
    useFormState<DownloadFormValues>({ subscription: { values: true } })

const initialValues = downloadSchema.parse({})

export const DownloadFormWrapper = ({
    children,
}: {
    children: React.ReactNode
}) => (
    // onSubmit is not used because the result of the form-state is just a link
    // only use form to handle state
    <Form onSubmit={() => undefined} initialValues={initialValues}>
        {() => children}
    </Form>
)
