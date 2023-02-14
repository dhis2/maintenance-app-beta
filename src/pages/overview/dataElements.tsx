import React from "react";
import i18n from "@dhis2/d2-i18n";
import { SummaryCard, SummaryCardGroup } from "../../components/card";
import { GroupOverview, GroupOverviewSummary } from "../../components/overview";

const TITLE = i18n.t("Data elements");

export const DataElementsOverview = () => {
    return (
        <GroupOverview title={i18n.t("Data elements")}>
            <GroupOverviewSummary>
                {i18n.t(
                    "Data elements are the core foundational item of DHIS2 and are used for data collection. Data elements can be organised by group and group set."
                )}
            </GroupOverviewSummary>
            <DataElementsCardGroup />
        </GroupOverview>
    );
};

export const DataElementsCardGroup = ({ showTitle }: { showTitle?: boolean }) => {
    return (
        <SummaryCardGroup title={showTitle && TITLE}>
            <SummaryCard title="Data Element" to={"/dataElements"}>
                {i18n.t(
                    "Building block elements of your database. The foundation of data collection and analysis."
                )}
            </SummaryCard>
            <SummaryCard title="Data Element group" to={"/dataElementGroups"}>
                {i18n.t(
                    "Improve analysis of single data elements by combining them into data element groups."
                )}
            </SummaryCard>
            <SummaryCard title="Data Element group set" to={"/dataElementGroupSet"}>
                {i18n.t(
                    "Add another level of organisation by grouping data element groups into group sets."
                )}
            </SummaryCard>
        </SummaryCardGroup>
    );
};

export default DataElementsOverview;
