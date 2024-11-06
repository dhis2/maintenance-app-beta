import React, { isValidElement } from 'react'
import { useSelectedSection } from '../../lib'
import { SectionedFormSectionProps } from './SectionedFormSections'

export type SectionedFormSectionRouterProps = {
    children: React.ReactNode
}
export const SectionedFormSectionRouter = ({
    children,
}: SectionedFormSectionRouterProps) => {
    const [selectedSection] = useSelectedSection()

    return React.Children.map(children, (c) => {
        if (!isValidElement(c) || c.type === React.Fragment) {
            return c
        }

        return React.cloneElement(c, {
            hidden:
                c.props.hidden != undefined
                    ? c.props.hidden
                    : c.props.name !== selectedSection,
        } as SectionedFormSectionProps)
    })
}
