import { useConfig } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { NoticeBox, Button } from "@dhis2/ui";
import React from "react";
import { useParams, Params } from "react-router-dom";
import { Section } from "../../constants";

const legacyPath = "/dhis-web-maintenance/index.html#/";

const legacyBaseUrl = (baseUrl: string) => `${baseUrl}${legacyPath}`;

const getLegacySectionPath = (
    section: Section,
    params: Params,
    isNew?: boolean
) => {
    let view = "list";
    let id = "";

    if (isNew || params.id) {
        view = "edit";
        id = isNew ? "add" : params?.id || "";
    }
    return `${view}/${section.name}Section/${section.name}/${id}`;
};

type LegacyAppRedirectProps = {
    section: Section;
    isNew?: boolean;
};

export const LegacyAppRedirect = ({
    section,
    isNew,
}: LegacyAppRedirectProps) => {
    const params = useParams();
    const { baseUrl } = useConfig();

    const redirectUrl = legacyBaseUrl(baseUrl).concat(
        getLegacySectionPath(section, params, isNew)
    );

    return (
        <NoticeBox title={i18n.t("Section is not implemented yet")}>
            <p>
                {i18n.t(
                    "This section has not been implemented yet. Click the button below to go to the corresponding page in the legacy app."
                )}
            </p>
            <a href={redirectUrl} target="_blank" rel="noreferrer">
                <Button>{i18n.t("Go to legacy app")}</Button>
            </a>
        </NoticeBox>
    );
};
