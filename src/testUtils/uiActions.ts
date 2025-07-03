import { RenderResult, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

const enterInputFieldValue = async (
    fieldName: string,
    text: string,
    screen: RenderResult
) => {
    const field = screen.getByTestId(`formfields-${fieldName}`)
    const input = within(field).getByRole('textbox') as HTMLInputElement
    await userEvent.type(input, text)
}
const clearInputField = async (fieldName: string, screen: RenderResult) => {
    const field = screen.getByTestId(`formfields-${fieldName}`)
    const input = within(field).getByRole('textbox') as HTMLInputElement
    await userEvent.clear(input)
}

const openModal = async (
    triggeringButton: HTMLElement,
    modalTestId: string,
    screen: RenderResult
) => {
    await userEvent.click(triggeringButton)
    const bulkSharingDialog = screen.getByTestId(modalTestId)
    expect(bulkSharingDialog).toBeVisible()
    return bulkSharingDialog
}

const openSingleSelect = async (
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
}

const closeSingleSelectIfOpen = async (
    triggeringDiv: HTMLElement,
    screen: RenderResult
) => {
    const optionsWrapper = await screen.queryByTestId(
        'dhis2-uicore-select-menu-menuwrapper'
    )
    if (optionsWrapper) {
        await userEvent.click(
            within(triggeringDiv).getByTestId('dhis2-uicore-select-input')
        )
    }
}

const submitForm = async (screen: RenderResult) => {
    const submitButton = screen.getByTestId('form-submit-button')
    await userEvent.click(submitButton)
}

const pickOptionInTransfer = async (
    transferTestId: string,
    optionText: string,
    screen: RenderResult
) => {
    const transfer = screen.getByTestId(transferTestId)
    expect(transfer).toBeVisible()
    const lhs = within(transfer).getByTestId(`${transferTestId}-leftside`)
    const lhsOptionToPick = within(lhs).getByText(optionText, {
        selector: '[data-test="dhis2-uicore-transferoption"]',
    })
    await userEvent.dblClick(lhsOptionToPick)
}

const pickColor = async (screen: RenderResult) => {
    const colorButton = screen.getByTestId('colorpicker-trigger')
    await userEvent.click(colorButton)
    const colors = screen.getByTestId('colors').querySelectorAll('span')
    await userEvent.click(colors[0])
    screen.debug(screen.getByTestId('colorpicker-trigger'))
}

const clickOnCheckboxField = async (
    fieldName: string,
    screen: RenderResult
) => {
    const field = screen.getByTestId(`formfields-${fieldName}`)
    const input = within(field).getByRole('checkbox') as HTMLInputElement
    await userEvent.click(input)
}

export const uiActions = {
    openModal,
    openSingleSelect,
    closeSingleSelectIfOpen,
    submitForm,
    enterInputFieldValue,
    enterName: async (text: string, screen: RenderResult) =>
        await enterInputFieldValue('name', text, screen),
    enterCode: async (text: string, screen: RenderResult) =>
        await enterInputFieldValue('code', text, screen),
    pickOptionInTransfer,
    clearInputField,
    // pickColor, Need to fix this
    clickOnCheckboxField,
}
