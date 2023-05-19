import { useNProgress } from "@tanem/react-nprogress";
import cx from "classnames";
import React from "react";
import { useNavigation, useLocation } from "react-router-dom";
import css from "./RouteProgressBar.module.css";

const LOADING_STATE = "loading";
const ANIMATION_DURATION = 200;

export const RouteProgress = () => {
    const navigation = useNavigation();
    const location = useLocation();
    const isLoading = navigation.state === LOADING_STATE;
    // key is used to reset the state of the progress when location changes
    // cannot use location.key directly since that will cancel the animation early (location.key and isLoading are updated at the same time)
    const [keyIncrement, setKeyIncrement] = React.useState(0);

    React.useEffect(() => {
        // use timeout so animation has a chance to complete before resetting
        const timeout = setTimeout(
            () => setKeyIncrement((inc) => inc + 1),
            ANIMATION_DURATION
        );
        () => clearTimeout(timeout);
    }, [location.key]);

    return <RouteProgressBar key={keyIncrement} isLoading={isLoading} />;
};

export const RouteProgressBar = ({ isLoading }) => {
    const { isFinished, progress } = useNProgress({
        animationDuration: ANIMATION_DURATION,
        isAnimating: isLoading,
    });

    return (
        <div
            className={cx(css.progressBarWrapper, {
                [css.finished]: isFinished,
            })}
            style={
                {
                    ["--animationDuration"]: `${ANIMATION_DURATION}ms`,
                } as React.CSSProperties
            }
        >
            <ProgressBar progress={progress} />
        </div>
    );
};

const ProgressBar = ({ progress }: { progress: number }) => {
    return (
        <div
            className={css.progressBar}
            style={
                {
                    ["--progress"]: `${(-1 + progress) * 100}%`,
                } as React.CSSProperties
            }
        ></div>
    );
};
