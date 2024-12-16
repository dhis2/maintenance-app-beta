import { generateDefaultAddFormTests } from '../../defaultFormTests'

generateDefaultAddFormTests({ componentName: 'Data set' })

xdescribe('Data set add form additional tests', () => {
    it('contain all needed field', () => {})
    it('should not submit when required values are missing', () => {})
    it('should submit the data and return to the list view on success', () => {})
    it('should show an error if name field is too long', () => {})
    it('should show an error if short name field is too long', () => {})
    it('should show an error if code field is too long', () => {})
    it('should show an error if description field is too long', () => {})
    it('should show an error if name field is already in use', () => {})
    it('should show an error if short name field is already in use', () => {})
    it('should show an error if code field is already in use', () => {})
})
