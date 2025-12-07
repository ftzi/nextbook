# Story Viewer Theme [STO.story-viewer.theme]

Users need control over the preview background color when developing components. Some components are designed for light backgrounds, others for dark. The system preference may not match the component's intended context.

## Design Decisions

The theme toggle is deliberately simple:
- Single button in toolbar (sun/moon icon)
- Three states: light, dark, system (auto)
- Persists to localStorage
- Affects only the story preview area, not the storify UI chrome

We don't provide granular background colors because:
- Complexity without clear benefit
- Users can set background in their own wrapper components
- Three modes cover 99% of use cases

---

## Theme Toggle [STO.story-viewer.theme.toggle]

A toggle button allows users to switch between light, dark, and system theme modes.

### Scenario: Toggle cycles through modes [STO.story-viewer.theme.toggle.cycle]
Testing: e2e
Promote: pending

- WHEN user clicks the theme toggle button
- THEN the theme cycles: system → light → dark → system
- AND the current mode is visually indicated

### Scenario: Theme persists across sessions [STO.story-viewer.theme.toggle.persist]
Testing: e2e
Promote: pending

- WHEN user selects a theme mode
- AND refreshes the page
- THEN the selected theme mode is restored
- AND localStorage key "storify-theme" contains the preference

### Scenario: System mode follows OS preference [STO.story-viewer.theme.toggle.system]
Testing: e2e
Promote: pending

- WHEN theme is set to "system" mode
- AND user's OS is set to dark mode
- THEN the preview area uses dark background
- AND when OS switches to light mode
- THEN the preview area uses light background

---

## Preview Background [STO.story-viewer.theme.background]

The preview area background color reflects the current theme.

### Scenario: Light theme background [STO.story-viewer.theme.background.light]
Testing: e2e
Promote: pending

- WHEN theme is "light"
- THEN preview area has white/light background (#ffffff or similar)
- AND provides good contrast for dark-themed components

### Scenario: Dark theme background [STO.story-viewer.theme.background.dark]
Testing: e2e
Promote: pending

- WHEN theme is "dark"
- THEN preview area has dark background (#1a1a1a or similar)
- AND provides good contrast for light-themed components
