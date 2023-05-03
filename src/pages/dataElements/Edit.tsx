import React from "react";
import { useParams } from "react-router-dom";

export const Component = () => {
    const { id } = useParams();
    // could do it like this instead of separate new and edit routes
    const isNew = id === "new";

    return <div>This is a form for dataElements</div>;
};
