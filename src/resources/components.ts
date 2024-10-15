export const components: any[] = [
    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Buttons
    // ------------------------------------------------------------------------------------- //
    { name: 'divider', text: '  ┳━ BUTTONS' },

    { name: 'button' },
    { name: 'file-trigger', children: [{ name: 'button' }] },
    { name: 'toggle', children: [{ name: 'button' }] },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Collections
    // ------------------------------------------------------------------------------------- //
    { name: 'divider', text: '  ╋━ COLLECTIONS' },

    { name: 'accordion' },
    { name: 'menu', children: [{ name: 'dropdown' }, { name: 'keyboard' }, { name: 'popover' }] },
    { name: 'list-box', children: [{ name: 'dropdown' }, { name: 'field' }] },
    { name: 'tabs' },
    { name: 'tag-group', children: [{ name: 'field' }, { name: 'badge' }] },
    { name: 'table', children: [{ name: 'checkbox' }] },
    { name: 'grid-list', children: [{ name: 'checkbox' }] },
    { name: 'choicebox', children: [{ name: 'checkbox' }, { name: 'field' }] },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Date and Time
    // ------------------------------------------------------------------------------------- //
    { name: 'divider', text: '  ╋━ DATE & TIME' },

    { name: 'calendar', children: [{ name: 'button' }] },
    { name: 'date-field' },
    { name: 'date-range-picker', children: [{ name: 'date-picker' }] },
    {
        name: 'date-picker',
        children: [{ name: 'popover' }, { name: 'field' }, { name: 'calendar' }, { name: 'date-field' }],
    },
    { name: 'time-field', children: [{ name: 'field' }, { name: 'date-field' }] },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Forms
    // ------------------------------------------------------------------------------------- //
    { name: 'divider', text: '  ╋━ FORMS' },

    { name: 'form' },
    { name: 'text-field', children: [{ name: 'field' }] },
    { name: 'input-otp' },
    { name: 'radio', children: [{ name: 'field' }] },
    { name: 'checkbox', children: [{ name: 'field' }] },
    { name: 'textarea', children: [{ name: 'field' }] },
    { name: 'number-field', children: [{ name: 'field' }] },
    { name: 'search-field', children: [{ name: 'field' }, { name: 'button' }] },
    { name: 'drop-zone' },
    {
        name: 'rich-text-field',
        children: [
            { name: 'field' },
            { name: 'button' },
            { name: 'keyboard' },
            { name: 'separator' },
            { name: 'toggle' },
            { name: 'tooltip' },
            { name: 'popover' },
        ],
    },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Navigation
    // ------------------------------------------------------------------------------------- //
    { name: 'divider', text: '  ╋━ NAVIGATION' },

    { name: 'link' },
    {
        name: 'pagination',
        children: [{ name: 'button' }],
    },
    {
        name: 'breadcrumbs',
        children: [{ name: 'link' }],
    },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Surfaces
    // ------------------------------------------------------------------------------------- //
    { name: 'divider', text: '  ╋━ SURFACES' },

    { name: 'card' },
    { name: 'grid' },
    { name: 'separator' },
    { name: 'show-more', children: [{ name: 'button' }] },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Media
    // ------------------------------------------------------------------------------------- //
    { name: 'divider', text: '  ╋━ MEDIA' },

    { name: 'avatar', children: [{ name: 'visually-hidden' }] },
    { name: 'carousel', children: [{ name: 'button' }] },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Overlays
    // ------------------------------------------------------------------------------------- //
    { name: 'divider', text: '  ╋━ OVERLAYS' },

    {
        name: 'modal',
        children: [{ name: 'dialog' }, { name: 'button' }, { name: 'heading' }],
    },
    {
        name: 'sheet',
        children: [{ name: 'dialog' }, { name: 'button' }, { name: 'heading' }],
    },
    {
        name: 'drawer',
        children: [{ name: 'dialog' }, { name: 'button' }, { name: 'heading' }],
    },
    {
        name: 'popover',
        children: [{ name: 'dialog' }, { name: 'button' }, { name: 'heading' }],
    },
    { name: 'tooltip' },
    { name: 'command', children: [{ name: 'separator' }, { name: 'keyboard' }] },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Pickers
    // ------------------------------------------------------------------------------------- //
    { name: 'divider', text: '  ╋━ PICKERS' },

    {
        name: 'combo-box',
        children: [
            { name: 'dropdown' },
            { name: 'field' },
            { name: 'list-box' },
            { name: 'popover' },
            { name: 'button' },
        ],
    },
    {
        name: 'select',
        children: [{ name: 'dropdown' }, { name: 'field' }, { name: 'list-box' }, { name: 'popover' }],
    },
    {
        name: 'multi-select',
        children: [
            { name: 'field' },
            { name: 'list-box' },
            { name: 'popover' },
            { name: 'tag-group' },
            { name: 'visually-hidden' },
            { name: 'button' },
        ],
    },
    {
        name: 'color-picker',
        children: [{ name: 'color' }, { name: 'color-field' }, { name: 'select' }],
    },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Statuses
    // ------------------------------------------------------------------------------------- //
    { name: 'divider', text: '  ╋━ STATUSES' },

    { name: 'skeleton' },
    { name: 'badge' },
    { name: 'loader' },
    { name: 'progress', children: [{ name: 'field' }] },
    { name: 'meter', children: [{ name: 'field' }] },
    { name: 'note' },
    { name: 'toaster', children: [{ name: 'button' }, { name: 'loader' }] },
    { name: 'rating', children: [{ name: 'field' }] },
    { name: 'charts' },

    // ------------------------------------------------------------------------------------- //
    // ⌘ The children of Layouts
    // ------------------------------------------------------------------------------------- //
    { name: 'divider', text: '  ╋━ LAYOUTS' },

    { name: 'sidebar', children: [{ name: 'accordion' }, { name: 'sheet' }] },
    { name: 'topbar', children: [{ name: 'sheet' }] },
]
