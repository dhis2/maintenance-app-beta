import React from 'react'
import { ConstantSelectionFilter } from './ConstantSelectionFilter'

type FilterWrapperProps = React.PropsWithChildren<{}>

export const FilterWrapper = () => {
    return (
        <div>
            <ConstantSelectionFilter label={'Domain type'} />
        </div>
    )
}
