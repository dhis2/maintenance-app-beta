
declare namespace NodeJS {
    interface Process {
        env: {
            [key: string]: string | undefined;
            NODE_ENV: "development" | "production" | "test";
        };
    }
}

declare module "*.bmp" {
    const src: string;
    export default src;
}

declare module "*.jpg" {
    const src: string;
    export default src;
}

declare module "*.jpeg" {
    const src: string;
    export default src;
}

declare module "*.png" {
    const src: string;
    export default src;
}

declare module "*.svg" {
    import * as React from "react";

    export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;

    const src: string;
    export default src;
}

declare module "*.module.css" {
    const classes: { [key: string]: string };
    export default classes;
}


