import { NoticeBox } from "@dhis2/ui";
import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { BaseLayoutWithSidebar } from "../layout";

export const DefaultErrorRoute = () => {
    const error = useRouteError();
    const isRouteError = isRouteErrorResponse(error);

    let title = "An error occurred";
    let message = error?.message ?? "An unknown error occurred.";
    if (isRouteError) {
        title = error.statusText
        message = error?.error?.message
    }
    return (
        <BaseLayoutWithSidebar>
            <NoticeBox
                warning={isRouteError}
                error={!isRouteError}
                title={title}
            >{message}</NoticeBox>
        </BaseLayoutWithSidebar>
    );
};
