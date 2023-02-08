import { CssReset, CssVariables } from "@dhis2/ui";
import React from "react";
import { LoadApp } from "./load-app";

interface AppWrapperProps {
    children: React.ReactNode;
}

export const AppWrapper = ({ children }: AppWrapperProps) => {
    return (
        <>
            <CssReset />
            <CssVariables spacers colors />
            <LoadApp>{children}</LoadApp>
        </>
    );
};
