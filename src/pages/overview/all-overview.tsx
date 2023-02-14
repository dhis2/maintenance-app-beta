import React from "react";
import { Outlet } from "react-router-dom";
import i18n from "@dhis2/d2-i18n";
import { SummaryCard, SummaryCardGroup } from "../../components/card/";
import { GroupOverview, GroupOverviewSummary } from "../../components/overview";

import { DataElementsCardGroup } from "./dataElements";

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


export const AllOverview = () => {
    return (
        <GroupOverview title={i18n.t("Metadata management")}>
            <DataElementsCardGroup showTitle={true} />
        </GroupOverview>
    );
    return <div>All Overviewz</div>;
};

export default AllOverview;
