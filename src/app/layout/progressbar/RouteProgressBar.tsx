import { useNProgress } from "@tanem/react-nprogress";
import cx from "classnames";
import React, { useEffect } from "react";
import { useNavigation } from "react-router-dom";
import css from "./RouteProgressBar.module.css";

const LOADING_STATE = "loading";
const ANIMATION_DURATION = 200;

export const RouteProgress = () => {
    const navigation = useNavigation();
    const isLoading = navigation.state === LOADING_STATE;
    // key is used to reset the state of the progress when location changes.
    // Cannot use navigation.location.key directly because navigation.location
    // will be undefined when navigation is not in a loading state, causing the animation
    // to cancel early because the key will change at the same time as isLoading.
    // ref holds the previous version of this value, so we can use it to create a "sticky" key
    const prevNavigationKeyRef = React.useRef<string | undefined>(undefined);
    const stickyKey = navigation.location?.key || prevNavigationKeyRef.current;

    useEffect(() => {
        const currentNavigationKey = navigation.location?.key;
        if (currentNavigationKey) {
            prevNavigationKeyRef.current = currentNavigationKey;
        }
    }, [navigation.location?.key]);

    return <RouteProgressBar key={stickyKey} isLoading={isLoading} />;
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
