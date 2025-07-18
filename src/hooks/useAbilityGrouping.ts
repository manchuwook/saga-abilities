import { useMemo } from 'react';
import { Ability } from '../models/abilities.zod';
import {
    AbilityGrouping,
    SimpleAbilityGrouping,
    TypeDisciplineGrouping,
    groupAbilitiesByDiscipline,
    groupAbilitiesByLevel,
    groupAbilitiesByType,
    groupAbilitiesByDisciplineLevelType,
    groupAbilitiesByTypeDiscipline,
    getUniqueDisciplines,
    getUniqueLevels,
    getUniqueTypes,
    sortAbilitiesInGroups,
    sortAbilitiesInNestedGroups,
    sortAbilitiesInTypeDisciplineGroups,
    normalizeAbilityType
} from '../utils/abilityGrouping';

/**
 * Hook options for ability grouping
 */
export interface UseAbilityGroupingOptions {
    /** Whether to sort abilities within groups alphabetically */
    sortWithinGroups?: boolean;
}

/**
 * Return type for the useAbilityGrouping hook
 */
export interface UseAbilityGroupingReturn {
    // Simple groupings
    byDiscipline: SimpleAbilityGrouping;
    byLevel: SimpleAbilityGrouping;
    byType: SimpleAbilityGrouping;

    // Nested groupings
    byDisciplineLevelType: AbilityGrouping;
    byTypeDiscipline: TypeDisciplineGrouping;

    // Unique values
    uniqueDisciplines: string[];
    uniqueLevels: string[];
    uniqueTypes: string[];

    // Utility functions
    normalizeType: (type: string) => string;
}

/**
 * Custom hook for grouping abilities by various criteria
 * @param abilities Array of abilities to group
 * @param options Configuration options
 * @returns Object containing grouped abilities and utility functions
 */
export const useAbilityGrouping = (
    abilities: Ability[],
    options: UseAbilityGroupingOptions = {}
): UseAbilityGroupingReturn => {
    const { sortWithinGroups = true } = options;

    // Memoize simple groupings
    const byDiscipline = useMemo(() => {
        const grouped = groupAbilitiesByDiscipline(abilities);
        return sortWithinGroups ? sortAbilitiesInGroups(grouped) : grouped;
    }, [abilities, sortWithinGroups]);

    const byLevel = useMemo(() => {
        const grouped = groupAbilitiesByLevel(abilities);
        return sortWithinGroups ? sortAbilitiesInGroups(grouped) : grouped;
    }, [abilities, sortWithinGroups]);

    const byType = useMemo(() => {
        const grouped = groupAbilitiesByType(abilities);
        return sortWithinGroups ? sortAbilitiesInGroups(grouped) : grouped;
    }, [abilities, sortWithinGroups]);

    // Memoize nested groupings
    const byDisciplineLevelType = useMemo(() => {
        const grouped = groupAbilitiesByDisciplineLevelType(abilities);
        return sortWithinGroups ? sortAbilitiesInNestedGroups(grouped) : grouped;
    }, [abilities, sortWithinGroups]);

    const byTypeDiscipline = useMemo(() => {
        const grouped = groupAbilitiesByTypeDiscipline(abilities);
        return sortWithinGroups ? sortAbilitiesInTypeDisciplineGroups(grouped) : grouped;
    }, [abilities, sortWithinGroups]);

    // Memoize unique values
    const uniqueDisciplines = useMemo(() =>
        getUniqueDisciplines(abilities),
        [abilities]
    );

    const uniqueLevels = useMemo(() =>
        getUniqueLevels(abilities),
        [abilities]
    );

    const uniqueTypes = useMemo(() =>
        getUniqueTypes(abilities),
        [abilities]
    );

    return {
        byDiscipline,
        byLevel,
        byType,
        byDisciplineLevelType,
        byTypeDiscipline,
        uniqueDisciplines,
        uniqueLevels,
        uniqueTypes,
        normalizeType: normalizeAbilityType,
    };
};
