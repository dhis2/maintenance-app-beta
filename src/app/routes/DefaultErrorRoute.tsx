import i18n from "@dhis2/d2-i18n";
import { NoticeBox, Button } from "@dhis2/ui";
import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { SidebarLayout } from "../layout";
import { useResetRouter } from "./ResetRouterContext";

const shouldShowResetRoutes = (e) => {
    if (e.name === "ChunkLoadError") {
        return true;
    }
};

export const DefaultErrorRoute = () => {
    const error = useRouteError();
    const isRouteError = isRouteErrorResponse(error);
    let title = "An error occurred";
    let message = error?.message ?? "An unknown error occurred.";

    if (isRouteError) {
        title = error.statusText;
        message = error?.error?.message;
    }

    const showRetry = shouldShowResetRoutes(error);
    return (
        <SidebarLayout>
            <NoticeBox
                warning={isRouteError}
                error={!isRouteError}
                title={title}
            >
                {message}
                {showRetry && <ResetRoutesRetry />}
            </NoticeBox>
        </SidebarLayout>
    );
};

// A button that can be used to hard reset the routes,
// remounting the router tree.
// This is useful for when a chunk fails to load
const ResetRoutesRetry = () => {
    const resetRouter = useResetRouter();

    return (
        <div style={{ paddingTop: "12px" }}>
            <Button onClick={resetRouter}>{i18n.t("Retry")}</Button>
        </div>
    );
};
