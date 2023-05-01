
export const routePaths = {
    overviewRoot: "/overview",
} as const;

export const getOverviewPath = (section: string) => {
    return `${routePaths.overviewRoot}/${section}`;
};
