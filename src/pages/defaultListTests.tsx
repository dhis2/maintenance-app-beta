export const generateDefaultListTests = ({
    componentName,
}: {
    componentName: string
}) => {
    generateDefaultListItemsTests({ componentName })
    generateDefaultListFiltersTests({ componentName })
    generateDefaultListRowActionsTests({ componentName })
    generateDefaultListMultiActionsTests({ componentName })
}

export const generateDefaultListItemsTests = ({
    componentName,
}: {
    componentName: string
}) => {
    xdescribe(`${componentName} default list tests`, () => {
        it('should display all the items in the first page', () => {})
        it('should display the default columns', () => {})
        it('can change the visible columns through manage view', () => {})
        it('should change the number of items that are displayed in a page when the number of items per page is changed', () => {})
        it('can navigate through pages and show the corresponding items', () => {})
        it('can sort the results by columns using a non case sensitive manner', () => {})
        it('should display error when an API call fails', () => {})
    })
}

export const generateDefaultListFiltersTests = ({
    componentName,
}: {
    componentName: string
}) => {
    xdescribe(`${componentName} default filter tests`, () => {
        it('scan filter the results by code using the input field', () => {})
        it('scan filter the results by name using the input field', () => {})
        it('scan filter the results by id using the input field', () => {})
        it('should display the default filters', () => {})
        it('can change the visible filters through manage view', () => {})
        it('can remove all filters through manage view', () => {})
    })
}

export const generateDefaultListRowActionsTests = ({
    componentName,
}: {
    componentName: string
}) => {
    xdescribe(`${componentName} default row actions tests`, () => {
        it('should display the default actions in the actions menu', () => {})
        it('redirect to the edit page when clicking on the edit action', () => {})
        it('redirects to the edit page when clicking on the pencil icon', () => {})
        it('deletes an item when pressing the delete action and confirming', () => {})
        it('updates the list when an item is deleted', () => {})
        it('shows the detail panel when the show details action is clicked', () => {})
        it('shows an edit button in the details panel', () => {})
        it('can copy the api url in the details panel', () => {})
        it('should open the sharing settings dialog when the sharing settings action is clicked', () => {})
        it('should update the list view when the sharing settings dialog is closed', () => {})
        it('should open a translation dialog when the translate action is clicked', () => {})
        it('should successfully save a new translation', () => {})
    })
}

export const generateDefaultListMultiActionsTests = ({
    componentName,
}: {
    componentName: string
}) => {
    xdescribe(`${componentName} default multiple actions tests`, () => {
        it('should display the multiple actions banner when 1 or more items are selected', () => {})
        it('should indicate how many items were selected', () => {})
        it('should update sharing settings for multiple items', () => {})
        it('should download multiple items', () => {})
        it('deselects all selected items', () => {})
    })
}
