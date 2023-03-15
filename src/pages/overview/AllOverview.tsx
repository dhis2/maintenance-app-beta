import i18n from "@dhis2/d2-i18n";
import React from "react";
import { GroupOverview } from "../../components/overview";
import { DataElementsCardGroup } from "./DataElements";

export const AllOverview = () => {
    return (
        <GroupOverview title={i18n.t("Metadata management")}>
            <DataElementsCardGroup showTitle={true} />
        </GroupOverview>
    );
};

export default AllOverview;
