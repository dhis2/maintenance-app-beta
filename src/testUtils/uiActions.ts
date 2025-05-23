import { RenderResult, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

export const uiActions = {
    openModal: async (
        triggeringButton: HTMLElement,
        modalTestId: string,
        screen: RenderResult
    ) => {
        await userEvent.click(triggeringButton)
        const bulkSharingDialog = screen.getByTestId(modalTestId)
        expect(bulkSharingDialog).toBeVisible()
        return bulkSharingDialog
    },
    openSingleSelect: async (
        triggeringDiv: HTMLElement,
        screen: RenderResult
    ) => {
        await userEvent.click(
            within(triggeringDiv).getByTestId('dhis2-uicore-select-input')
        )
        const optionsWrapper = await screen.findByTestId(
            'dhis2-uicore-select-menu-menuwrapper'
        )
        expect(optionsWrapper).toBeVisible()
        return within(optionsWrapper).getAllByTestId(
            'dhis2-uicore-singleselectoption'
        )
    },
}
