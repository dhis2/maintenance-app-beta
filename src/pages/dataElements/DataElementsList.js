import React from 'react';
import { GridContainer } from '../../components/Grid/GridContainer';
import { GridContent } from '../../components/Grid/GridContent';
import { Sidebar } from './Sidebar';

export const DataElementsList = (props) => console.log('props', props) || (
    <GridContainer>
        <Sidebar />
        <GridContent>
            <span>Data elements list...</span>
        </GridContent>
    </GridContainer>
)
