import i18n from "@dhis2/d2-i18n";
import React from "react";
import { CategoryCardGroup } from "./Categories";
import { DataElementsCardGroup } from "./DataElements";
import { OverviewGroup } from "./group";

export const AllOverview = () => {
    return (
        <OverviewGroup title={i18n.t("Metadata management")}>
            <DataElementsCardGroup showTitle={true} />
            <CategoryCardGroup showTitle={true} />
        </OverviewGroup>

    );
};

export const Component = AllOverview;
export default AllOverview;
