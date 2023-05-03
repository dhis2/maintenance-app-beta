import { useConfig } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { NoticeBox, Button } from "@dhis2/ui";
import React from "react";
import { useParams, Params } from "react-router-dom";
import { Section, SECTIONS_MAP } from "../../constants";

const legacyPath = "/dhis-web-maintenance/index.html#/";

const getLegacyBaseUrl = (baseUrl: string) => `${baseUrl}${legacyPath}`;

// some sections does not have the same "parent"-section in legacy app
// so we need to map them to the correct "parent" in the legacy app
const legacySectionMap = {
    [SECTIONS_MAP.program.parentSectionKey]: "program",
};

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

    let legacySection = legacySectionMap[section.name];
    if (!legacySection) {
        legacySection = section.parentSectionKey ?? section.name;
    }

    return `${view}/${legacySection}Section/${section.name}/${id}`;
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

    const redirectUrl = getLegacyBaseUrl(baseUrl).concat(
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
