import i18n from "@dhis2/d2-i18n";
import React from "react";
import { SECTIONS_MAP } from "../../constants";
import { SummaryCard, SummaryCardGroup } from "./card";
import { OverviewGroup, OverviewGroupSummary } from "./group";

const TITLE = SECTIONS_MAP.category.titlePlural;

export const CategoryOverview = () => {
    return (
        <OverviewGroup title={TITLE}>
            <OverviewGroupSummary>
                {i18n.t(
                    "Data elements are the core foundational item of DHIS2 and are used for data collection. Data elements can be organised by group and group set."
                )}
            </OverviewGroupSummary>
            <CategoryCardGroup />
        </OverviewGroup>
    );
};

export const CategoryCardGroup = ({ showTitle }: { showTitle?: boolean }) => {
    return (
        <SummaryCardGroup title={showTitle ? TITLE : undefined}>
            <SummaryCard section={SECTIONS_MAP.categoryOption}>
                {i18n.t(
                    "Individual values or options that can be selected within a category."
                )}
            </SummaryCard>
            <SummaryCard section={SECTIONS_MAP.category}>
                {i18n.t(
                    "Disaggregate data elements into individual components. Can also be used to to assign metadata attributes to data sets or programs."
                )}
            </SummaryCard>
            <SummaryCard section={SECTIONS_MAP.categoryCombo}>
                {i18n.t(
                    "Combine multiple categories into a related set that can be assigned to data elements for dissagregation."
                )}
            </SummaryCard>
            <SummaryCard section={SECTIONS_MAP.categoryOptionCombo}>
                {i18n.t(
                    `Specify code and attributes to enable easier data exchange with other systems.`
                )}
            </SummaryCard>
            <SummaryCard section={SECTIONS_MAP.categoryOptionGroup}>
                {i18n.t(
                    "Group category options and improve analysis with category option group sets."
                )}
            </SummaryCard>
            <SummaryCard section={SECTIONS_MAP.categoryOptionGroupSet}>
                {i18n.t(
                    "Classify category options groups to add more dimensionality to captured data for analysis."
                )}
            </SummaryCard>
        </SummaryCardGroup>
    );
};

export const Component = CategoryOverview;
