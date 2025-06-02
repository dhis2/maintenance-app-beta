import { faker } from '@faker-js/faker'
import { RenderResult, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { randomLongString } from './builders'
import { uiActions } from './uiActions'

const expectInputFieldToExist = (
    fieldName: string,
    value: string,
    screen: RenderResult
) => {
    const field = screen.getByTestId(`formfields-${fieldName}`)
    expect(field).toBeVisible()
    const input = within(field).getByRole('textbox') as HTMLInputElement
    expect(input).toBeVisible()
    expect(input).toHaveAttribute('name', fieldName)
    expect(input).toHaveAttribute('value', value)
}
const expectFieldToHaveError = (
    fieldTestId: string,
    errorText: string,
    screen: RenderResult
) => {
    const field = screen.getByTestId(fieldTestId)
    const input = within(field).getByRole('textbox') as HTMLInputElement
    expect(input).toHaveClass('error')
    const error = within(field).getByTestId(`${fieldTestId}-validation`)
    expect(error).toBeVisible()
    expect(error).toHaveTextContent(errorText)
}

const expectTransferFieldToExistWithOptions = async (
    transferTestId: string,
    expected: {
        lhs: {
            displayName: string
        }[]
        rhs: {
            displayName: string
        }[]
    },
    screen: RenderResult
) => {
    const transfer = screen.getByTestId(transferTestId)
    expect(transfer).toBeVisible()
    const lhs = within(transfer).getByTestId(`${transferTestId}-leftside`)
    await waitFor(() => {
        const lhsOptions = within(lhs).queryAllByTestId(
            'dhis2-uicore-transferoption'
        )
        expect(lhsOptions).toHaveLength(expected.lhs.length)
        expected.lhs.map((option, index) => {
            expect(lhsOptions[index]).toHaveTextContent(option.displayName)
        })
    })
    const rhs = within(transfer).getByTestId(`${transferTestId}-rightside`)
    const rhsOptions = within(rhs).queryAllByTestId(
        'dhis2-uicore-transferoption'
    )
    expect(rhsOptions).toHaveLength(expected.rhs.length)
    expected.rhs.map((option, index) => {
        expect(rhsOptions[index]).toHaveTextContent(option.displayName)
    })
}

const expectInputToErrorWhenExceedsLength = async (
    fieldName: string,
    maxLength: number,
    screen: RenderResult
) => {
    const longText = randomLongString(maxLength + 1)
    await uiActions.enterInputFieldValue(fieldName, longText, screen)
    await userEvent.click(screen.getByTestId(`formfields-${fieldName}-label`))
    await expectFieldToHaveError(
        `formfields-${fieldName}`,
        `Please enter a maximum of ${maxLength} characters`,
        screen
    )
}

const expectInputToErrorWhenDuplicate = async (
    fieldName: string,
    duplicateText: string,
    screen: RenderResult
) => {
    await uiActions.enterInputFieldValue(fieldName, duplicateText, screen)
    await userEvent.click(screen.getByTestId(`formfields-${fieldName}-label`))
    await expectFieldToHaveError(
        `formfields-${fieldName}`,
        `This field requires a unique value, please choose another one`,
        screen
    )
}

export const uiAssertions = {
    expectNameFieldExist: (value: string, screen: RenderResult) =>
        expectInputFieldToExist('name', value, screen),
    expectCodeFieldExist: (value: string, screen: RenderResult) =>
        expectInputFieldToExist('code', value, screen),
    expectFieldToHaveError,
    expectTransferFieldToExistWithOptions,
    expectInputToErrorWhenExceedsLength,
    expectNameToErrorWhenExceedsLength: (
        screen: RenderResult,
        maxLength = 230
    ) => expectInputToErrorWhenExceedsLength('name', maxLength, screen),
    expectCodeToErrorWhenExceedsLength: (
        screen: RenderResult,
        maxLength = 50
    ) => expectInputToErrorWhenExceedsLength('code', maxLength, screen),
    expectNameToErrorWhenDuplicate: (
        duplicateName: string,
        screen: RenderResult
    ) => expectInputToErrorWhenDuplicate('name', duplicateName, screen),
    expectCodeToErrorWhenDuplicate: (
        duplicateCode: string,
        screen: RenderResult
    ) => expectInputToErrorWhenDuplicate('code', duplicateCode, screen),
}
