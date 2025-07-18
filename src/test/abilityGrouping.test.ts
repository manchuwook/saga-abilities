import { describe, it, expect } from 'vitest';
import {
    normalizeAbilityType,
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
    sortAbilitiesInTypeDisciplineGroups
} from '../utils/abilityGrouping';
import { Ability } from '../models/abilities.zod';

// Sample test data
const testAbilities: Ability[] = [
    {
        abilityName: 'Advance!',
        abilityCp: 8,
        abilityDiscipline: 'Leadership',
        abilityLevel: 'Intermediate',
        abilityType: 'Boost (M+10T)',
        abilityDescription: 'Test description'
    },
    {
        abilityName: 'Aerial Flip',
        abilityCp: 16,
        abilityDiscipline: 'Tumbling',
        abilityLevel: 'Advanced',
        abilityType: 'Reaction (G+25T)',
        abilityDescription: 'Test description'
    },
    {
        abilityName: 'Aeromancy I',
        abilityCp: 4,
        abilityDiscipline: 'Elementalism',
        abilityLevel: 'Basic',
        abilityType: 'Modifier',
        abilityDescription: 'Test description'
    },
    {
        abilityName: 'Aeromancy II',
        abilityCp: 8,
        abilityDiscipline: 'Elementalism',
        abilityLevel: 'Intermediate',
        abilityType: 'Modifier',
        abilityDescription: 'Test description'
    },
    {
        abilityName: 'Block and Step',
        abilityCp: 4,
        abilityDiscipline: 'Shield_Use',
        abilityLevel: 'Basic',
        abilityType: 'Boost (5T)',
        abilityDescription: 'Test description'
    }
];

describe('abilityGrouping utilities', () => {
    describe('normalizeAbilityType', () => {
        it('should remove cost information in parentheses', () => {
            expect(normalizeAbilityType('Boost (M+10T)')).toBe('Boost');
            expect(normalizeAbilityType('Reaction (G+25T)')).toBe('Reaction');
            expect(normalizeAbilityType('Boost (5T)')).toBe('Boost');
            expect(normalizeAbilityType('Complex (50T+1RP)')).toBe('Complex');
        });

        it('should handle types without parentheses', () => {
            expect(normalizeAbilityType('Modifier')).toBe('Modifier');
            expect(normalizeAbilityType('Stance')).toBe('Stance');
        });

        it('should handle multiple parentheses groups', () => {
            expect(normalizeAbilityType('Maneuver (Effect=BOD) (Special)')).toBe('Maneuver');
        });

        it('should trim whitespace', () => {
            expect(normalizeAbilityType('  Boost (M)  ')).toBe('Boost');
        });
    });

    describe('groupAbilitiesByDiscipline', () => {
        it('should group abilities by discipline', () => {
            const grouped = groupAbilitiesByDiscipline(testAbilities);

            expect(grouped['Leadership']).toHaveLength(1);
            expect(grouped['Leadership'][0].abilityName).toBe('Advance!');

            expect(grouped['Elementalism']).toHaveLength(2);
            expect(grouped['Elementalism'].map(a => a.abilityName)).toContain('Aeromancy I');
            expect(grouped['Elementalism'].map(a => a.abilityName)).toContain('Aeromancy II');

            expect(grouped['Tumbling']).toHaveLength(1);
            expect(grouped['Shield_Use']).toHaveLength(1);
        });
    });

    describe('groupAbilitiesByLevel', () => {
        it('should group abilities by level', () => {
            const grouped = groupAbilitiesByLevel(testAbilities);

            expect(grouped['Basic']).toHaveLength(2);
            expect(grouped['Basic'].map(a => a.abilityName)).toContain('Aeromancy I');
            expect(grouped['Basic'].map(a => a.abilityName)).toContain('Block and Step');

            expect(grouped['Intermediate']).toHaveLength(2);
            expect(grouped['Intermediate'].map(a => a.abilityName)).toContain('Advance!');
            expect(grouped['Intermediate'].map(a => a.abilityName)).toContain('Aeromancy II');

            expect(grouped['Advanced']).toHaveLength(1);
            expect(grouped['Advanced'][0].abilityName).toBe('Aerial Flip');
        });
    });

    describe('groupAbilitiesByType', () => {
        it('should group abilities by normalized type', () => {
            const grouped = groupAbilitiesByType(testAbilities);

            expect(grouped['Boost']).toHaveLength(2);
            expect(grouped['Boost'].map(a => a.abilityName)).toContain('Advance!');
            expect(grouped['Boost'].map(a => a.abilityName)).toContain('Block and Step');

            expect(grouped['Modifier']).toHaveLength(2);
            expect(grouped['Modifier'].map(a => a.abilityName)).toContain('Aeromancy I');
            expect(grouped['Modifier'].map(a => a.abilityName)).toContain('Aeromancy II');

            expect(grouped['Reaction']).toHaveLength(1);
            expect(grouped['Reaction'][0].abilityName).toBe('Aerial Flip');
        });
    });

    describe('groupAbilitiesByDisciplineLevelType', () => {
        it('should create nested grouping structure', () => {
            const grouped = groupAbilitiesByDisciplineLevelType(testAbilities);

            // Check that the structure is correct
            expect(grouped['Elementalism']).toBeDefined();
            expect(grouped['Elementalism']['Basic']).toBeDefined();
            expect(grouped['Elementalism']['Basic']['Modifier']).toBeDefined();
            expect(grouped['Elementalism']['Basic']['Modifier']).toHaveLength(1);
            expect(grouped['Elementalism']['Basic']['Modifier'][0].abilityName).toBe('Aeromancy I');

            expect(grouped['Elementalism']['Intermediate']).toBeDefined();
            expect(grouped['Elementalism']['Intermediate']['Modifier']).toBeDefined();
            expect(grouped['Elementalism']['Intermediate']['Modifier']).toHaveLength(1);
            expect(grouped['Elementalism']['Intermediate']['Modifier'][0].abilityName).toBe('Aeromancy II');

            expect(grouped['Leadership']['Intermediate']['Boost']).toHaveLength(1);
            expect(grouped['Tumbling']['Advanced']['Reaction']).toHaveLength(1);
            expect(grouped['Shield_Use']['Basic']['Boost']).toHaveLength(1);
        });
    });

    describe('getUniqueDisciplines', () => {
        it('should return sorted unique disciplines', () => {
            const disciplines = getUniqueDisciplines(testAbilities);

            expect(disciplines).toHaveLength(4);
            expect(disciplines).toEqual(['Elementalism', 'Leadership', 'Shield_Use', 'Tumbling']);
        });
    });

    describe('getUniqueLevels', () => {
        it('should return levels in correct order', () => {
            const levels = getUniqueLevels(testAbilities);

            expect(levels).toHaveLength(3);
            expect(levels).toEqual(['Basic', 'Intermediate', 'Advanced']);
        });

        it('should only include levels that exist in the data', () => {
            const abilitiesWithoutAdvanced = testAbilities.filter(a => a.abilityLevel !== 'Advanced');
            const levels = getUniqueLevels(abilitiesWithoutAdvanced);

            expect(levels).toHaveLength(2);
            expect(levels).toEqual(['Basic', 'Intermediate']);
        });
    });

    describe('getUniqueTypes', () => {
        it('should return sorted unique normalized types', () => {
            const types = getUniqueTypes(testAbilities);

            expect(types).toHaveLength(3);
            expect(types).toEqual(['Boost', 'Modifier', 'Reaction']);
        });
    });

    describe('sortAbilitiesInGroups', () => {
        it('should sort abilities alphabetically within each group', () => {
            // Create unsorted groups
            const unsortedGroups = {
                'Test1': [testAbilities[1], testAbilities[0]], // Aerial Flip, Advance!
                'Test2': [testAbilities[3], testAbilities[2]]  // Aeromancy II, Aeromancy I
            };

            const sorted = sortAbilitiesInGroups(unsortedGroups);

            expect(sorted['Test1'][0].abilityName).toBe('Advance!');
            expect(sorted['Test1'][1].abilityName).toBe('Aerial Flip');

            expect(sorted['Test2'][0].abilityName).toBe('Aeromancy I');
            expect(sorted['Test2'][1].abilityName).toBe('Aeromancy II');
        });
    });

    describe('sortAbilitiesInNestedGroups', () => {
        it('should sort abilities alphabetically within nested groups', () => {
            const unsorted = groupAbilitiesByDisciplineLevelType([
                testAbilities[3], // Aeromancy II
                testAbilities[2], // Aeromancy I
                testAbilities[1], // Aerial Flip
                testAbilities[0]  // Advance!
            ]);

            const sorted = sortAbilitiesInNestedGroups(unsorted);

            // Check that Elementalism abilities are sorted correctly
            const elementalismModifiers = sorted['Elementalism']['Basic']['Modifier'];
            expect(elementalismModifiers[0].abilityName).toBe('Aeromancy I');

            const elementalismIntermediateModifiers = sorted['Elementalism']['Intermediate']['Modifier'];
            expect(elementalismIntermediateModifiers[0].abilityName).toBe('Aeromancy II');
        });
    });

    describe('groupAbilitiesByTypeDiscipline', () => {
        it('should group abilities by type then by discipline', () => {
            const grouped = groupAbilitiesByTypeDiscipline(testAbilities);

            // Check that types are correctly grouped
            expect(Object.keys(grouped)).toContain('Modifier');
            expect(Object.keys(grouped)).toContain('Boost');
            expect(Object.keys(grouped)).toContain('Reaction');

            // Check that disciplines are correctly nested under types
            expect(Object.keys(grouped['Modifier'])).toContain('Elementalism');
            expect(Object.keys(grouped['Boost'])).toContain('Leadership');
            expect(Object.keys(grouped['Reaction'])).toContain('Tumbling');

            // Check specific abilities
            expect(grouped['Modifier']['Elementalism']).toHaveLength(2);
            expect(grouped['Modifier']['Elementalism'][0].abilityName).toBe('Aeromancy I');
            expect(grouped['Modifier']['Elementalism'][1].abilityName).toBe('Aeromancy II');

            expect(grouped['Boost']['Leadership']).toHaveLength(1);
            expect(grouped['Boost']['Leadership'][0].abilityName).toBe('Advance!');
        });

        it('should handle empty input', () => {
            const grouped = groupAbilitiesByTypeDiscipline([]);
            expect(Object.keys(grouped)).toHaveLength(0);
        });

        it('should normalize ability types by removing cost information', () => {
            const grouped = groupAbilitiesByTypeDiscipline(testAbilities);

            // Should have "Boost" not "Boost (M+10T)"
            expect(Object.keys(grouped)).toContain('Boost');
            expect(Object.keys(grouped)).not.toContain('Boost (M+10T)');

            // Should have "Reaction" not "Reaction (G+25T)"
            expect(Object.keys(grouped)).toContain('Reaction');
            expect(Object.keys(grouped)).not.toContain('Reaction (G+25T)');
        });
    });

    describe('sortAbilitiesInTypeDisciplineGroups', () => {
        it('should sort abilities alphabetically within type-discipline groups', () => {
            const unsorted = groupAbilitiesByTypeDiscipline([
                testAbilities[3], // Aeromancy II
                testAbilities[2], // Aeromancy I
                testAbilities[1], // Aerial Flip
                testAbilities[0]  // Advance!
            ]);

            const sorted = sortAbilitiesInTypeDisciplineGroups(unsorted);

            // Check that Modifier > Elementalism abilities are sorted correctly
            const modifierElementalism = sorted['Modifier']['Elementalism'];
            expect(modifierElementalism[0].abilityName).toBe('Aeromancy I');
            expect(modifierElementalism[1].abilityName).toBe('Aeromancy II');
        });
    });
});
