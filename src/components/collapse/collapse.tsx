
import React from "react";

interface CollapseProps {
    children: React.ReactNode;
    open: boolean;
}
// create a collapse react component that can be used later on
export const Collapse = ({ children, open }: CollapseProps) => {
    if(!open) {
        return null;
    }

    return (
        <div className="collapse">
            {children}
        </div>
    );
};
