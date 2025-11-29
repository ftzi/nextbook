# sidebar-navigation Specification

## Purpose
TBD - created by archiving change redesign-sidebar-navigation. Update Purpose after archive.
## Requirements
### Requirement: Component-Centric Sidebar

The sidebar SHALL display story files as single navigation items without variant expansion.

#### Scenario: Story file as single item
- **WHEN** a story file exists in the registry
- **THEN** it appears as a single clickable item in the sidebar
- **AND** clicking it navigates to `/ui/{filePath}`
- **AND** no expansion or variant list is shown in the sidebar

#### Scenario: No module loading in sidebar
- **WHEN** the sidebar renders
- **THEN** no story modules are loaded
- **AND** no loading indicators appear
- **AND** the sidebar is instantly interactive

#### Scenario: Folder organization preserved
- **WHEN** story files are organized in folders (e.g., `forms/input`)
- **THEN** folders appear as collapsible nodes in the sidebar
- **AND** folders start collapsed by default
- **AND** expanding a folder shows its children (files or subfolders)

### Requirement: Tabbed Story View

The story page SHALL display all exports from a story file as tabs.

#### Scenario: Tabs for all story exports
- **WHEN** navigating to a story file (e.g., `/ui/button`)
- **THEN** the page loads the story module once
- **AND** a tab bar displays all story exports from that file
- **AND** the first story is selected by default

#### Scenario: Tab selection via URL
- **WHEN** navigating to `/ui/button/secondary`
- **THEN** the "Secondary" tab is selected
- **AND** the Secondary story content is displayed

#### Scenario: Tab click updates URL
- **WHEN** a user clicks a tab
- **THEN** the URL updates to include the story name
- **AND** the story content updates to show the selected story
- **AND** browser history is updated (back button works)

#### Scenario: Invalid story name in URL
- **WHEN** navigating to `/ui/button/nonexistent`
- **THEN** the first available tab is selected
- **AND** the URL is NOT automatically corrected (preserves user intent for debugging)

### Requirement: Story Type Badges

Tabs SHALL display badges indicating the type of each story.

#### Scenario: Simple story (no badge)
- **WHEN** a story has no Zod schema
- **THEN** the tab displays only the story name
- **AND** no badge icon is shown

#### Scenario: Controlled story badge
- **WHEN** a story has a Zod schema (interactive controls)
- **THEN** the tab displays a controls icon (⚡ or similar)
- **AND** the icon appears after the story name
- **AND** the icon has a tooltip explaining "Has interactive controls"

#### Scenario: Matrix story badge
- **WHEN** a story is a matrix story
- **THEN** the tab displays a grid icon (▦ or similar)
- **AND** the icon appears after the story name
- **AND** the icon has a tooltip explaining "Matrix view"

### Requirement: Single Module Load

The system SHALL load each story module only once per navigation.

#### Scenario: Module loaded on navigation
- **WHEN** a user navigates to a story file
- **THEN** the module is loaded exactly once
- **AND** all exports are extracted from that single load

#### Scenario: Tab switching without reload
- **WHEN** a user switches between tabs
- **THEN** no additional module loads occur
- **AND** the content switches instantly

#### Scenario: Navigating to different file
- **WHEN** a user navigates to a different story file
- **THEN** the new file's module is loaded
- **AND** the previous module can be garbage collected

### Requirement: URL Structure Compatibility

The URL structure SHALL remain backwards compatible.

#### Scenario: File-only URL
- **WHEN** navigating to `/ui/button`
- **THEN** the page displays the Button stories
- **AND** the first tab is selected

#### Scenario: File with story URL
- **WHEN** navigating to `/ui/button/controlled`
- **THEN** the page displays the Button stories
- **AND** the "Controlled" tab is selected

#### Scenario: Nested file URL
- **WHEN** navigating to `/ui/forms/input`
- **THEN** the page displays the Input stories
- **AND** the first tab is selected

#### Scenario: Nested file with story URL
- **WHEN** navigating to `/ui/forms/input/withplaceholder`
- **THEN** the page displays the Input stories
- **AND** the "WithPlaceholder" tab is selected (case-insensitive match)

### Requirement: Tab Bar Overflow Handling

The tab bar SHALL handle many stories gracefully.

#### Scenario: Few stories (no overflow)
- **WHEN** a story file has 5 or fewer exports
- **THEN** all tabs are visible without scrolling

#### Scenario: Many stories (overflow)
- **WHEN** a story file has more tabs than fit in the viewport
- **THEN** the tab bar becomes horizontally scrollable
- **AND** fade indicators show more content exists in scroll direction

### Requirement: Active Story Indicator

The sidebar and tab bar SHALL clearly indicate the current selection.

#### Scenario: Active file in sidebar
- **WHEN** viewing a story file
- **THEN** that file is highlighted in the sidebar
- **AND** ancestor folders are expanded to show the active file

#### Scenario: Active tab in tab bar
- **WHEN** viewing a specific story
- **THEN** that tab has distinct active styling
- **AND** the active indicator animates smoothly when switching tabs

