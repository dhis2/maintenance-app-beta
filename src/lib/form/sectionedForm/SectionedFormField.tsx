import React, { useEffect } from 'react'
import { useRegisterField } from './useRegister'

type SectionedFormField = {
    label: string
    name: string
    children: React.ReactNode
}
export const SectionFormField = ({
    label,
    name,
    children,
}: SectionedFormField) => {
    const register = useRegisterField()

    useEffect(() => {
        register({ name, label })
    }, [register, name, label])

    return children
}
