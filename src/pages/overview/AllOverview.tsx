import i18n from "@dhis2/d2-i18n";
import React from "react";
import { DataElementsCardGroup } from "./DataElements";
import { GroupOverview } from "./overview";

export const AllOverview = () => {
    return (
        <GroupOverview title={i18n.t("Metadata management")}>
            <DataElementsCardGroup showTitle={true} />
        </GroupOverview>
    );
};

export const Component = AllOverview;
export default AllOverview;
