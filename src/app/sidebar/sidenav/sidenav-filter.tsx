import React, { useState } from "react";
import { Menu, MenuItem, Input } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import styles from "./sidenav.module.css";

export type OnChangeInput = {
    name?: string;
    value: string;
};
export type OnChangeCallback = (
    input: OnChangeInput,
    e: React.ChangeEvent<HTMLInputElement>
) => void;

interface SidenavParentProps {
    onChange?: OnChangeCallback;
}

export const SidenavFilter = ({ onChange }: SidenavParentProps) => {
    const [value, setValue] = useState("");

    const handleChange = (
        input: OnChangeInput,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setValue(input.value);
        if (onChange) {
            onChange(input, e);
        }
    };

    return (
        <Input
            className={styles["sidenav-filter"]}
            dense
            type="text"
            value={value}
            placeholder={i18n.t("Search for menu items")}
            onChange={handleChange}
        />
    );
};
