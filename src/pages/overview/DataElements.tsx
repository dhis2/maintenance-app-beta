import i18n from "@dhis2/d2-i18n";
import React from "react";
import { getSectionPath } from "../../app/routes/routePaths";
import { SECTIONS_MAP } from "../../constants";
import { SummaryCard, SummaryCardGroup } from "./card";
import { OverviewGroup, OverViewGroupSummary } from "./group";
const TITLE = SECTIONS_MAP.dataElement.titlePlural;

export const DataElementsOverview = () => {
    return (
        <OverviewGroup title={TITLE}>
            <OverViewGroupSummary>
                {i18n.t(
                    "Data elements are the core foundational item of DHIS2 and are used for data collection. Data elements can be organised by group and group set."
                )}
            </OverViewGroupSummary>
            <DataElementsCardGroup />
        </OverviewGroup>
    );
};

export const DataElementsCardGroup = ({
    showTitle,
}: {
    showTitle?: boolean;
}) => {
    return (
        <SummaryCardGroup title={showTitle ? TITLE : undefined}>
            <SummaryCard
                title={SECTIONS_MAP.dataElement.title}
                to={getSectionPath(SECTIONS_MAP.dataElement)}
            >
                {i18n.t(
                    "Building block elements of your database. The foundation of data collection and analysis."
                )}
            </SummaryCard>
            <SummaryCard
                title={SECTIONS_MAP.dataElementGroup.title}
                to={getSectionPath(SECTIONS_MAP.dataElementGroup)}
            >
                {i18n.t(
                    "Improve analysis of single data elements by combining them into data element groups."
                )}
            </SummaryCard>
            <SummaryCard
                title={SECTIONS_MAP.dataElementGroupSet.title}
                to={getSectionPath(SECTIONS_MAP.dataElementGroupSet)}
            >
                {i18n.t(
                    "Add another level of organisation by grouping data element groups into group sets."
                )}
            </SummaryCard>
        </SummaryCardGroup>
    );
};

export const Component = DataElementsOverview;
