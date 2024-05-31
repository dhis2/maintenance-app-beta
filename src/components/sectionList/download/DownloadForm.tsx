import React from 'react'
import { useFormState, withTypes } from 'react-final-form'
import { z } from 'zod'

const downloadSchema = z.object({
    compression: z.enum(['zip', 'gz', 'uncompressed']).default('zip'),
    includeSharing: z.boolean().default(true),
    filterType: z.enum(['filters', 'selected', 'all']).default('all'),
})

export type DownloadFormValues = z.infer<typeof downloadSchema>

const { Form } = withTypes<DownloadFormValues>()

export const useDownloadFormState = () =>
    useFormState<DownloadFormValues>({ subscription: { values: true } })

const getInititalValues = ({ hasSelected }: { hasSelected: boolean }) => {
    return downloadSchema.parse({
        filterType: hasSelected ? 'selected' : 'all',
    })
}

export const DownloadFormWrapper = ({
    children,
    hasSelected,
}: {
    children: React.ReactNode
    hasSelected: boolean
}) => {
    const initialValues = React.useMemo(
        () => getInititalValues({ hasSelected }),
        [hasSelected]
    )

    // onSubmit is not used because the result of the form-state is just a link
    // only use form to handle state
    return (
        <Form
            onSubmit={() => undefined}
            initialValues={initialValues}
            subscription={{}}
        >
            {() => children}
        </Form>
    )
}
