import React from 'react'

import { GridContainer } from '../../components/Grid/GridContainer'
import { GridContent } from '../../components/Grid/GridContent'
import { Sidebar } from '../../components/Sidebar'
import { sections } from '../../constants/sections'
import { subSectionOrder } from '../../constants/sectionOrder'

const { dataElement } = sections

export const DataElementList = () => (
    <GridContainer>
        <Sidebar sections={subSectionOrder.dataElement} />

        <GridContent>
            <h1>{dataElement.sections.dataElement.name}</h1>
            <span>Data elements list...</span>
        </GridContent>
    </GridContainer>
)
