import { generateDefaultAddFormTests } from '../defaultFormTests'

generateDefaultAddFormTests({ componentName: 'Category combo' })

xdescribe('Category combo add form additional tests', () => {
    it('contain all needed field', () => {})
    it('should not submit when required values are missing', () => {})
    it('should submit the data and return to the list view on success', () => {})
    it('should show an error if name field is too long', () => {})
    it('should show an error if code field is too long', () => {})
    it('should show an error if name field is a duplicate', () => {})
    it('should show an error if code field is a duplicate', () => {})
    it('not show an add all button for categories', () => {})
})