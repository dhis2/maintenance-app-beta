import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/* When the app is running in the Global Shell, the URL is not updated.
    The Global Shell is listening to "popstate" events to update the URL.
    However react-router@6+ does not trigger "popstate" events on pushState/replaceState.

    Thus we need to listen to react-router's location changes and dispatch a "popstate" event.

    Some background for react-router change: https://github.com/remix-run/react-router/blob/44472360ec9ea045008f453280bb749cb58e90ea/decisions/0005-remixing-react-router.md#inline-the-history-library-into-the-router

*/

export const SyncUrlWithGlobalShell = ({
    children,
}: {
    children?: React.ReactNode
}) => {
    const location = useLocation()

    useEffect(() => {
        dispatchEvent(new PopStateEvent('popstate'))
    }, [location.key])

    return children
}
