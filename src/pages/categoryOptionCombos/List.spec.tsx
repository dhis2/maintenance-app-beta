import {
    generateDefaultListFiltersTests,
    generateDefaultListItemsTests,
    generateDefaultListMultiActionsTests,
    generateDefaultListRowActionsTests,
} from '../defaultListTests'

const componentName = 'Category option combo'
generateDefaultListItemsTests({ componentName })
generateDefaultListFiltersTests({ componentName })
generateDefaultListMultiActionsTests({ componentName })

xdescribe('Category option combo additional tests', () => {
    it('should filter by category option', () => {})
    it('should filter by category combo', () => {})
    it('should display the show details, edit and translate actions in the menu', () => {})
    it('redirect to the edit page when clicking on the edit action', () => {})
    it('redirects to the edit page when clicking on the pencil icon', () => {})
    it('shows the detail panel when the show details action is clicked', () => {})
    it('shows an edit button in the details panel', () => {})
    it('can copy the api url in the details panel', () => {})
    it('should open a translation dialog when the translate action is clicked', () => {})
    it('should successfully save a new translation', () => {})
})
