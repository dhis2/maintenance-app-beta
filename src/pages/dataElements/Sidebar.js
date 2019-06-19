import { Link } from 'react-router-dom';
import React from 'react';
import { GridSidebar } from '../../components/Grid/GridSidebar';

export const Sidebar = () => (
    <GridSidebar>
        <div>
            <Link to="/list/dataElementSection/dataElement">
                Data elements
            </Link>
            <br />

            <Link to="/list/dataElementSection/dataElementGroup">
                Data element groups
            </Link>
            <br />

            <Link to="/list/dataElementSection/dataElementGroupSet">
                Data element group sets
            </Link>
        </div>
    </GridSidebar>
)
