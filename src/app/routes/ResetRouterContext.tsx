import { createContext, useContext } from "react";

export const ResetRouterContext = createContext<{ reset: () => void }>({
    reset: () => ({}),
});

export const useResetRouter = () => useContext(ResetRouterContext).reset;
