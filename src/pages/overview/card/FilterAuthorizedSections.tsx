import React, { ReactElement } from 'react'
import {
    useIsSectionAuthorizedPredicate,
    useIsSectionFeatureToggle,
} from '../../../lib'
import { Section } from '../../../types'

export type FilterAuthorizedSectionsProps = {
    children:
        | ReactElement<{
              section?: Section
          }>[]
        | ReactElement<{
              section?: Section
          }>
}

export const FilterAuthorizedSections = ({
    children,
}: FilterAuthorizedSectionsProps) => {
    const isSectionAuthorized = useIsSectionAuthorizedPredicate()
    const isSectionFeatureToggled = useIsSectionFeatureToggle()
    return (
        <>
            {React.Children.map(children, (child) => {
                if (!child.props.section) {
                    return child
                }
                if (
                    child &&
                    isSectionAuthorized(child.props.section) &&
                    isSectionFeatureToggled(child.props.section)
                ) {
                    return child
                }
                return null
            })}
        </>
    )
}
