export const generateDefaultMergeTests = ({
    componentName,
}: {
    componentName: string
}) => {
    xdescribe(`${componentName} default merge tests`, () => {
        it('shows a component to pick the source objects, a component to pick the target object and a radio button to delete sources', () => {})
        it('does not allow to pick as a target an object that already has been picked as a source', () => {})
        it('does not allow to pick as a source an object that already has been picked as the target', () => {})
        it('shows a confirmation component when sources and target have been selected', () => {})
        it('goes back to the list when teh cancel button is pressed', () => {})
        it('it errors if no source has been selected', () => {})
        it('it errors if no target has been selected', () => {})
        it('it errors if teh validation code was not entered', () => {})
        it('it errors if the code in the confirmation component does not match the code given', () => {})
        it('performs a merge when the form is correctly filled in and the merge button is pressed', () => {})
        it('when the merge operation is in progress the a box with a loader appears', () => {})
        it('when the merge operation is successful then a success message appears', () => {})
        it('when the merge operation errors then i see an error message', () => {})
    })
}
