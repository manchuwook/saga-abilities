/**
 * This file contains utilities to help suppress React warnings that might be triggered
 * but can be safely ignored in our application context.
 */

/**
 * Transforms CSS selectors with kebab-case data attributes to camelCase format for React
 * This helps avoid the "Unsupported style property" warning that React throws
 * when using data attributes in CSS selectors.
 * 
 * @param styles The styles object containing CSS selectors
 * @returns A new styles object with transformed selectors
 */
export function transformDataAttributeSelectors<T extends Record<string, any>>(styles: T): T {
    const transformedStyles: Record<string, any> = {};

    for (const [key, value] of Object.entries(styles)) {
        if (typeof value === 'object' && value !== null) {
            // Recursively transform nested objects
            transformedStyles[key] = transformDataAttributeSelectors(value);
        } else {
            // Copy primitive values directly
            transformedStyles[key] = value;
        }
    }

    // Process any data-* attribute selectors at this level
    for (const [key, value] of Object.entries(transformedStyles)) {
        if (typeof key === 'string' && key.includes('data-')) {
            // Create a camelCase version of the selector
            const camelCaseKey = key.replace(
                /&\[data-([a-zA-Z0-9-]+)(=|~=||=|\^=|\$=|\*=)(".*?"|\S+)\]/g,
                (match, attr, operator, val) => {
                    const camelAttr = attr.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
                    return `&[${camelAttr}${operator}${val}]`;
                }
            );

            // Only add the camelCase version if it's different from the original
            if (camelCaseKey !== key) {
                transformedStyles[camelCaseKey] = value;
            }
        }
    }

    return transformedStyles as T;
}

/**
 * A React-specific version of the CSS selector transformer that specifically
 * handles the '&[data-active="true"]' case that's common in Mantine components.
 * 
 * @param styles The styles object containing CSS selectors
 * @returns A new styles object with transformed selectors for React
 */
export function adaptMantineTabsStylesForReact<T extends Record<string, any>>(styles: T): T {
    const reactStyles = { ...styles };

    // Deep clone and transform the tab styling object
    if (reactStyles.tab && typeof reactStyles.tab === 'object') {
        const tabStyles = { ...reactStyles.tab };

        // If the original has the kebab-case selector, ensure we have the camelCase version
        if (tabStyles['&[data-active="true"]']) {
            tabStyles['&[dataActive="true"]'] = { ...tabStyles['&[data-active="true"]'] };
        }

        reactStyles.tab = tabStyles;
    }

    return reactStyles;
}
