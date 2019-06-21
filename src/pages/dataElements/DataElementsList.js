import React from 'react'

import { GridContainer } from '../../components/Grid/GridContainer'
import { GridContent } from '../../components/Grid/GridContent'
import { Sidebar } from '../../components/Sidebar'
import { sections } from './sections'

export const DataElementsList = () => (
    <GridContainer>
        <Sidebar
            sections={[
                sections.dataElements,
                sections.dataElementGroup,
                sections.dataElementGroupSet,
            ]}
        />

        <GridContent>
            <span>Data elements list...</span>
        </GridContent>
    </GridContainer>
)
