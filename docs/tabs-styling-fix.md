<!-- filepath: x:\dev\saga-abilities\docs\tabs-styling-fix.md -->

# Tabs Styling Fix

## Problem

The application was experiencing issues with the tabs component styling, particularly in dark mode. The tabs were not consistently styled between light and dark modes, and there were problems with the active tab indicator.

## Root Causes

1. Incorrect CSS selector for active tabs - React expects `&[dataActive="true"]` (camelCase) while CSS would normally use `&[data-active="true"]` (kebab-case)
2. Inconsistent styling application between the direct `getTabsStyles()` method and the Mantine theme integration
3. Over-reliance on conditional theme styles that weren't being applied correctly
4. Inconsistent color contrast in dark mode

## Solution

1. Fixed the CSS selector issue by:
   - Creating a utility function to transform data attributes in selectors to React's expected format
   - Converting selectors using `&[data-active="true"]` to `&[dataActive="true"]`
   - Adapting the tab styles in the useStyles hook
2. Standardized the tab styling across both the `getTabsStyles()` method and the Mantine theme configuration
3. Added specific styling for all tab states (normal, hover, active) with consistent color scheme integration
4. Enhanced the tab color contrast, especially in dark mode
5. Applied consistent border styling for the active tabs
6. Improved the spacing between the tabs and content
7. Updated the `SafeTabs` component to use the memoized `tabsStyles` from the `useStyles` hook instead of directly accessing the StyleService

## Benefits

- Consistent tab appearance between light and dark modes
- Better visual indication of the active tab
- Improved accessibility through better color contrast
- More maintainable code with a single source of truth for tab styling
- Smoother transitions between tab states with added animation
- Better integration with Mantine's theme system
- No more React warnings for unsupported style properties

## Styling Details

- Normal tabs: Light gray text in dark mode, dark gray text in light mode
- Active tabs: White text with blue-tinted border in dark mode, dark text with blue border in light mode
- Added consistent font weight changes (500 normal, 600 active)
- Applied proper border styling to indicate the active tab
- Consistent hover effect with subtle background color changes

## Technical Note

React automatically converts kebab-case attributes like `data-active` to camelCase properties like `dataActive` in JSX.
This conversion causes issues when using CSS selectors in React's CSS-in-JS styling systems because React doesn't
recognize the kebab-case version in the style objects. A utility function was created to handle this conversion.
