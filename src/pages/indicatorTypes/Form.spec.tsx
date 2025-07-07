describe('Indicator types form tests', () => {
    describe('Common', () => {
        it('should not submit when a required values is missing ', () => {})
        it('should show an error if name field is too long', () => {})
        it('should show an error if factor field is too large', () => {})
        it('should show an error if factor field is too small', () => {})
        it('allow factor field to be 0', () => {})
    })
    describe('New', () => {
        it('contain all needed field', () => {})
        it('should have a cancel button with a link back to the list view', () => {})
        it('should submit the data', () => {})
    })
    describe('Edit', () => {
        it('contain all needed field prefilled', () => {})
        it('should submit the data and return to the list view on success when a field is changed', () => {})
        it('should do nothing and return to the list view on success when no field is changed', () => {})
    })
})
