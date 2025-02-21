import React, { ReactElement } from 'react'
import { useIsSectionAuthorizedPredicate } from '../../../lib'
import { Section } from '../../../types'

type FilterAuthorizedSectionsProps = {
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
    return (
        <>
            {React.Children.map(children, (child) => {
                if (!child.props.section) {
                    return child
                }
                if (child && isSectionAuthorized(child.props.section)) {
                    return child
                }
                return null
            })}
        </>
    )
}
