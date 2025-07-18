import { Ability } from '../models/abilities.zod';

/**
 * Interface for grouped abilities by type, then discipline
 */
export interface TypeDisciplineGrouping {
    [type: string]: {
        [discipline: string]: Ability[];
    };
}

/**
 * Interface for grouped abilities by discipline, level, and type
 */
export interface AbilityGrouping {
    [discipline: string]: {
        [level: string]: {
            [type: string]: Ability[];
        };
    };
}

/**
 * Interface for simple grouped abilities (single level grouping)
 */
export interface SimpleAbilityGrouping<T = Ability[]> {
    [key: string]: T;
}

/**
 * Utility function to normalize ability type by removing cost information in parentheses
 * @param abilityType The raw ability type string
 * @returns The normalized type without cost information
 */
export const normalizeAbilityType = (abilityType: string): string => {
    // Remove everything in parentheses and trim whitespace
    return abilityType.replace(/\s*\([^)]*\)\s*/g, '').trim();
};

/**
 * Groups abilities by discipline
 * @param abilities Array of abilities to group
 * @returns Object with disciplines as keys and arrays of abilities as values
 */
export const groupAbilitiesByDiscipline = (abilities: Ability[]): SimpleAbilityGrouping => {
    return abilities.reduce((acc, ability) => {
        const discipline = ability.abilityDiscipline;
        if (!acc[discipline]) {
            acc[discipline] = [];
        }
        acc[discipline].push(ability);
        return acc;
    }, {} as SimpleAbilityGrouping);
};

/**
 * Groups abilities by level
 * @param abilities Array of abilities to group
 * @returns Object with levels as keys and arrays of abilities as values
 */
export const groupAbilitiesByLevel = (abilities: Ability[]): SimpleAbilityGrouping => {
    return abilities.reduce((acc, ability) => {
        const level = ability.abilityLevel;
        if (!acc[level]) {
            acc[level] = [];
        }
        acc[level].push(ability);
        return acc;
    }, {} as SimpleAbilityGrouping);
};

/**
 * Groups abilities by normalized type (without cost information)
 * @param abilities Array of abilities to group
 * @returns Object with normalized types as keys and arrays of abilities as values
 */
export const groupAbilitiesByType = (abilities: Ability[]): SimpleAbilityGrouping => {
    return abilities.reduce((acc, ability) => {
        const normalizedType = normalizeAbilityType(ability.abilityType);
        if (!acc[normalizedType]) {
            acc[normalizedType] = [];
        }
        acc[normalizedType].push(ability);
        return acc;
    }, {} as SimpleAbilityGrouping);
};

/**
 * Groups abilities by discipline, then by level, then by type
 * @param abilities Array of abilities to group
 * @returns Nested object structure grouped by discipline > level > type
 */
export const groupAbilitiesByDisciplineLevelType = (abilities: Ability[]): AbilityGrouping => {
    return abilities.reduce((acc, ability) => {
        const discipline = ability.abilityDiscipline;
        const level = ability.abilityLevel;
        const normalizedType = normalizeAbilityType(ability.abilityType);

        // Initialize nested structure if it doesn't exist
        if (!acc[discipline]) {
            acc[discipline] = {};
        }
        if (!acc[discipline][level]) {
            acc[discipline][level] = {};
        }
        if (!acc[discipline][level][normalizedType]) {
            acc[discipline][level][normalizedType] = [];
        }

        acc[discipline][level][normalizedType].push(ability);
        return acc;
    }, {} as AbilityGrouping);
};

/**
 * Groups abilities by type, then by discipline
 * @param abilities Array of abilities to group
 * @returns Nested object structure grouped by type > discipline
 */
export const groupAbilitiesByTypeDiscipline = (abilities: Ability[]): TypeDisciplineGrouping => {
    return abilities.reduce((acc, ability) => {
        const normalizedType = normalizeAbilityType(ability.abilityType);
        const discipline = ability.abilityDiscipline;

        // Initialize nested structure if it doesn't exist
        if (!acc[normalizedType]) {
            acc[normalizedType] = {};
        }
        if (!acc[normalizedType][discipline]) {
            acc[normalizedType][discipline] = [];
        }

        acc[normalizedType][discipline].push(ability);
        return acc;
    }, {} as TypeDisciplineGrouping);
};

/**
 * Gets all unique disciplines from an array of abilities
 * @param abilities Array of abilities
 * @returns Sorted array of unique disciplines
 */
export const getUniqueDisciplines = (abilities: Ability[]): string[] => {
    const disciplines = new Set(abilities.map(ability => ability.abilityDiscipline));
    return Array.from(disciplines).sort();
};

/**
 * Gets all unique levels from an array of abilities
 * @param abilities Array of abilities
 * @returns Array of unique levels in order: Basic, Intermediate, Advanced
 */
export const getUniqueLevels = (abilities: Ability[]): string[] => {
    const levels = new Set(abilities.map(ability => ability.abilityLevel));
    const levelOrder = ['Basic', 'Intermediate', 'Advanced'] as const;
    return levelOrder.filter(level => levels.has(level as any));
};

/**
 * Gets all unique normalized types from an array of abilities
 * @param abilities Array of abilities
 * @returns Sorted array of unique normalized types
 */
export const getUniqueTypes = (abilities: Ability[]): string[] => {
    const types = new Set(abilities.map(ability => normalizeAbilityType(ability.abilityType)));
    return Array.from(types).sort();
};

/**
 * Sorts abilities within groups alphabetically by name
 * @param groupedAbilities Grouped abilities object
 * @returns The same object structure with abilities sorted alphabetically
 */
export const sortAbilitiesInGroups = <T extends { [key: string]: Ability[] }>(groupedAbilities: T): T => {
    const sorted = {} as T;
    Object.keys(groupedAbilities).forEach(key => {
        sorted[key as keyof T] = [...groupedAbilities[key]].sort((a, b) =>
            a.abilityName.localeCompare(b.abilityName)
        ) as T[keyof T];
    });
    return sorted;
};

/**
 * Sorts abilities within nested groups (discipline > level > type) alphabetically by name
 * @param groupedAbilities Nested grouped abilities object
 * @returns The same object structure with abilities sorted alphabetically
 */
export const sortAbilitiesInNestedGroups = (groupedAbilities: AbilityGrouping): AbilityGrouping => {
    const sorted: AbilityGrouping = {};

    Object.keys(groupedAbilities).forEach(discipline => {
        sorted[discipline] = {};
        Object.keys(groupedAbilities[discipline]).forEach(level => {
            sorted[discipline][level] = {};
            Object.keys(groupedAbilities[discipline][level]).forEach(type => {
                sorted[discipline][level][type] = [...groupedAbilities[discipline][level][type]]
                    .sort((a, b) => a.abilityName.localeCompare(b.abilityName));
            });
        });
    });

    return sorted;
};

/**
 * Sorts abilities within type-discipline groups alphabetically by name
 * @param groupedAbilities Type-discipline grouped abilities object
 * @returns The same object structure with abilities sorted alphabetically
 */
export const sortAbilitiesInTypeDisciplineGroups = (groupedAbilities: TypeDisciplineGrouping): TypeDisciplineGrouping => {
    const sorted: TypeDisciplineGrouping = {};

    Object.keys(groupedAbilities).forEach(type => {
        sorted[type] = {};
        Object.keys(groupedAbilities[type]).forEach(discipline => {
            sorted[type][discipline] = [...groupedAbilities[type][discipline]]
                .sort((a, b) => a.abilityName.localeCompare(b.abilityName));
        });
    });

    return sorted;
};
