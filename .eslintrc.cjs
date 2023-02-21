//const { config } = require("@dhis2/cli-style");
import { config } from "@dhis2/cli-style";

module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        config.eslintReact,
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    root: true,
};
