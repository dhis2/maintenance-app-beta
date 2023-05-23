import i18n from "@dhis2/d2-i18n";
import { NoticeBox } from "@dhis2/ui";
import React from "react";

export const NotFound = () => {
    return (
        <NoticeBox warning title={i18n.t("Not found")}>
            {i18n.t("The page you are looking for does not exist.")}
        </NoticeBox>
    );
};
