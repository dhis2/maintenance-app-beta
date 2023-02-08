import React from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { Loader } from "../components/loading/Loader";

const query = {
    schemas: {
        resource: "schemas",
        fields: "authorities, displayName, name, plural, singular, translatable, properties",
    },
};

export const LoadApp = ({ children }) => {
    const queryResponse = useDataQuery(query);
    return (
        <Loader queryResponse={queryResponse} label="schemas">
            {children}
        </Loader>
    );
};
