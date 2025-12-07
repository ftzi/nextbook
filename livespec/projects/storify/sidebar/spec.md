# Sidebar Navigation *[STY-sidebar]*

The sidebar provides navigation for the storify UI at `/ui`. It displays story files organized by folder structure, allowing developers to quickly browse and select components to view.

## Design Decisions

We display story files as single navigation items rather than expanding to show individual exports. This keeps the sidebar clean and fast — no module loading required for sidebar rendering, instant interactivity on page load.

Individual story exports (variants) are shown as tabs in the main content area, not nested in the sidebar. This reduces sidebar complexity and allows all variants to be accessible via URL.

---

## Component-Centric Sidebar *[STY-sidebar.component]*

The sidebar displays story files as single navigation items without variant expansion.

### Scenario: Story file as single item *[STY-sidebar.component.single-item]*
Testing: e2e

- WHEN a story file exists in the registry
- THEN it appears as a single clickable item in the sidebar
- AND clicking it navigates to `/ui/{filePath}`
- AND no expansion or variant list is shown in the sidebar

### Scenario: No module loading in sidebar *[STY-sidebar.component.no-loading]*
Testing: e2e

- WHEN the sidebar renders
- THEN no story modules are loaded
- AND no loading indicators appear
- AND the sidebar is instantly interactive

### Scenario: Folder organization preserved *[STY-sidebar.component.folders]*
Testing: e2e

- WHEN story files are organized in folders (e.g., `forms/input`)
- THEN folders appear as collapsible nodes in the sidebar
- AND folders start collapsed by default
- AND expanding a folder shows its children (files or subfolders)

---

## Tabbed Story View *[STY-sidebar.tabs]*

The story page displays all exports from a story file as tabs.

### Scenario: Tabs for all story exports *[STY-sidebar.tabs.display]*
Testing: e2e

- WHEN navigating to a story file (e.g., `/ui/button`)
- THEN the page loads the story module once
- AND a tab bar displays all story exports from that file
- AND the first story is selected by default

### Scenario: Tab selection via URL *[STY-sidebar.tabs.url-select]*
Testing: e2e

- WHEN navigating to `/ui/button/secondary`
- THEN the "Secondary" tab is selected
- AND the Secondary story content is displayed

### Scenario: Tab click updates URL *[STY-sidebar.tabs.click-url]*
Testing: e2e

- WHEN a user clicks a tab
- THEN the URL updates to include the story name
- AND the story content updates to show the selected story
- AND browser history is updated (back button works)

### Scenario: Invalid story name in URL *[STY-sidebar.tabs.invalid-url]*
Testing: e2e

- WHEN navigating to `/ui/button/nonexistent`
- THEN the first available tab is selected
- AND the URL is NOT automatically corrected (preserves user intent for debugging)

---

## Story Type Badges *[STY-sidebar.badges]*

Tabs display badges indicating the type of each story.

### Scenario: Simple story (no badge) *[STY-sidebar.badges.simple]*
Testing: e2e

- WHEN a story has no Zod schema
- THEN the tab displays only the story name
- AND no badge icon is shown

### Scenario: Controlled story badge *[STY-sidebar.badges.controlled]*
Testing: e2e

- WHEN a story has a Zod schema (interactive controls)
- THEN the tab displays a controls icon
- AND the icon appears after the story name
- AND the icon has a tooltip explaining "Has interactive controls"

### Scenario: Matrix story badge *[STY-sidebar.badges.matrix]*
Testing: e2e

- WHEN a story is a matrix story
- THEN the tab displays a grid icon
- AND the icon appears after the story name
- AND the icon has a tooltip explaining "Matrix view"

---

## Single Module Load *[STY-sidebar.single-load]*

The system loads each story module only once per navigation.

### Scenario: Module loaded on navigation *[STY-sidebar.single-load.navigation]*
Testing: e2e

- WHEN a user navigates to a story file
- THEN the module is loaded exactly once
- AND all exports are extracted from that single load

### Scenario: Tab switching without reload *[STY-sidebar.single-load.tab-switch]*
Testing: e2e

- WHEN a user switches between tabs
- THEN no additional module loads occur
- AND the content switches instantly

### Scenario: Navigating to different file *[STY-sidebar.single-load.different-file]*
Testing: e2e

- WHEN a user navigates to a different story file
- THEN the new file's module is loaded
- AND the previous module can be garbage collected

---

## URL Structure *[STY-sidebar.url]*

The URL structure remains backwards compatible.

### Scenario: File-only URL *[STY-sidebar.url.file-only]*
Testing: e2e

- WHEN navigating to `/ui/button`
- THEN the page displays the Button stories
- AND the first tab is selected

### Scenario: File with story URL *[STY-sidebar.url.file-story]*
Testing: e2e

- WHEN navigating to `/ui/button/controlled`
- THEN the page displays the Button stories
- AND the "Controlled" tab is selected

### Scenario: Nested file URL *[STY-sidebar.url.nested]*
Testing: e2e

- WHEN navigating to `/ui/forms/input`
- THEN the page displays the Input stories
- AND the first tab is selected

### Scenario: Nested file with story URL *[STY-sidebar.url.nested-story]*
Testing: e2e

- WHEN navigating to `/ui/forms/input/withplaceholder`
- THEN the page displays the Input stories
- AND the "WithPlaceholder" tab is selected (case-insensitive match)

---

## Tab Bar Overflow *[STY-sidebar.overflow]*

The tab bar handles many stories gracefully.

### Scenario: Few stories (no overflow) *[STY-sidebar.overflow.few]*
Testing: e2e

- WHEN a story file has 5 or fewer exports
- THEN all tabs are visible without scrolling

### Scenario: Many stories (overflow) *[STY-sidebar.overflow.many]*
Testing: e2e

- WHEN a story file has more tabs than fit in the viewport
- THEN the tab bar becomes horizontally scrollable
- AND fade indicators show more content exists in scroll direction

---

## Active Story Indicator *[STY-sidebar.active]*

The sidebar and tab bar clearly indicate the current selection.

### Scenario: Active file in sidebar *[STY-sidebar.active.file]*
Testing: e2e

- WHEN viewing a story file
- THEN that file is highlighted in the sidebar
- AND ancestor folders are expanded to show the active file

### Scenario: Active tab in tab bar *[STY-sidebar.active.tab]*
Testing: e2e

- WHEN viewing a specific story
- THEN that tab has distinct active styling
- AND the active indicator animates smoothly when switching tabs
