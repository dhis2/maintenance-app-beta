import { generateDefaultAddFormTests } from '../defaultFormTests'

generateDefaultAddFormTests({ componentName: 'Data set' })

xdescribe('Data set add form additional tests', () => {
    it('contain all needed field', () => {})
    it('should not submit when required values are missing', () => {})
    it('should submit the data and return to the list view on success', () => {})
    it('should show an error if name field is too long', () => {})
    it('should show an error if short name field is too long', () => {})
    it('should show an error if code field is too long', () => {})
    it('should show an error if description field is too long', () => {})
    it('should show an error if name field is a duplicate', () => {})
    it('should show an error if short name field is a duplicate', () => {})
    it('should show an input when "allow data entry for future periods" is checked and submit the value', () => {})
    it('should submit 0 when the "allow data entry for future periods" is checked, a value is entered and then unchecked', () => {})
    it('should show an input when "close data entry a certain number of days after period end" is checked and submit the value', () => {})
    it('should submit 0 when the "close data entry a certain number of days after period end" is checked, a value is entered and then unchecked', () => {})
    it('should show a checkbox fow "close data entry after implementing partner category option end date" when a category combo is selected', () => {})
    it('should now show a checkbox fow "close data entry after implementing partner category option end date" when the None category combo is selected', () => {})
    it('should show an input when "close data entry after implementing partner category option end date" is checked and submit the value', () => {})
    it('should submit 0 when the "close data entry after implementing partner category option end date" is checked, a value is entered and then unchecked', () => {})
})