import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAbilityManuals } from '../hooks/useAbilityManuals';
import { AbilityManualsProvider } from '../context/AbilityManualsContext';
import { Spell } from '../models/abilities.zod';
import { ReactNode } from 'react';

// Test wrapper component for the context
const wrapper = ({ children }: { children: ReactNode }) => (
  <AbilityManualsProvider>{children}</AbilityManualsProvider>
);

// Sample spell data for testing
const testSpell: Spell = {
  spellName: 'Test Spell',
  spellClass: 'elementalism',
  school: 'pyromancy',
  complexity: 'medium-complexity',
  flare: 'medium-flare',
  range: '30 feet',
  target: 'single-target',
  action: 'Standard',
  duration: 'Instant',
  keywords: 'fire, damage',
  check: 'Intelligence + Evocation',
  skill: 'Evocation',
  focus: 'Wand',
  spellType: 'Attack',
  description: 'A test spell that shoots fire',
  altDescription: null,
};

describe('useAbilityManuals Hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
    
    // Mock crypto.randomUUID for consistent IDs in tests
    vi.stubGlobal('crypto', {
      randomUUID: () => 'test-uuid-123'
    });
  });

  test('should create a AbilityManual, add a spell, remove a spell, and delete the AbilityManual', () => {
    // Initialize the hook with context
    const { result } = renderHook(() => useAbilityManuals(), { wrapper });

    // Verify initial state: empty AbilityManuals array
    expect(result.current.AbilityManuals).toEqual([]);

    // Step 1: Create a new AbilityManual
    act(() => {
      result.current.addAbilityManual({
        name: 'Test AbilityManual',
        character: 'Test Character',
        description: 'Test Description',
        abilities: [],
      });
    });

    // Verify AbilityManual was created with correct data
    expect(result.current.AbilityManuals).toHaveLength(1);
    expect(result.current.AbilityManuals[0]).toMatchObject({
      id: 'test-uuid-123',
      name: 'Test AbilityManual',
      character: 'Test Character',
      description: 'Test Description',
      abilities: [],
    });
    expect(result.current.AbilityManuals[0].createdAt).toBeInstanceOf(Date);
    expect(result.current.AbilityManuals[0].updatedAt).toBeInstanceOf(Date);

    // Step 2: Add a spell to the AbilityManual
    act(() => {
      result.current.addSpellToAbilityManual('test-uuid-123', testSpell);
    });

    // Verify spell was added
    expect(result.current.AbilityManuals[0].abilities).toHaveLength(1);
    expect(result.current.AbilityManuals[0].abilities[0]).toEqual(testSpell);

    // Step 3: Remove the spell from the AbilityManual
    act(() => {
      result.current.removeSpellFromAbilityManual('test-uuid-123', 'Test Spell');
    });

    // Verify spell was removed
    expect(result.current.AbilityManuals[0].abilities).toHaveLength(0);

    // Step 4: Delete the AbilityManual
    act(() => {
      result.current.deleteAbilityManual('test-uuid-123');
    });

    // Verify AbilityManual was deleted
    expect(result.current.AbilityManuals).toHaveLength(0);
  });

  test('should not add duplicate abilities to a AbilityManual', () => {
    // Initialize the hook with context
    const { result } = renderHook(() => useAbilityManuals(), { wrapper });

    // Create a AbilityManual
    act(() => {
      result.current.addAbilityManual({
        name: 'Test AbilityManual',
        character: 'Test Character',
        description: 'Test Description',
        abilities: [],
      });
    });

    // Add a spell
    act(() => {
      result.current.addSpellToAbilityManual('test-uuid-123', testSpell);
    });

    // Try to add the same spell again
    act(() => {
      result.current.addSpellToAbilityManual('test-uuid-123', testSpell);
    });

    // Verify the spell was added only once
    expect(result.current.AbilityManuals[0].abilities).toHaveLength(1);
  });

  test('should correctly update a AbilityManual', () => {
    // Initialize the hook with context
    const { result } = renderHook(() => useAbilityManuals(), { wrapper });

    // Create a AbilityManual
    act(() => {
      result.current.addAbilityManual({
        name: 'Test AbilityManual',
        character: 'Test Character',
        description: 'Test Description',
        abilities: [],
      });
    });

    // Update the AbilityManual
    act(() => {
      result.current.updateAbilityManual('test-uuid-123', {
        name: 'Updated AbilityManual',
        character: 'Updated Character',
        description: 'Updated Description',
      });
    });

    // Verify the update
    expect(result.current.AbilityManuals[0].name).toBe('Updated AbilityManual');
    expect(result.current.AbilityManuals[0].character).toBe('Updated Character');
    expect(result.current.AbilityManuals[0].description).toBe('Updated Description');
  });

  test('should correctly retrieve a AbilityManual by id', () => {
    // Initialize the hook with context
    const { result } = renderHook(() => useAbilityManuals(), { wrapper });

    // Create a AbilityManual
    act(() => {
      result.current.addAbilityManual({
        name: 'Test AbilityManual',
        character: 'Test Character',
        description: 'Test Description',
        abilities: [],
      });
    });

    // Get the AbilityManual by ID
    const AbilityManual = result.current.getAbilityManual('test-uuid-123');

    // Verify the retrieved AbilityManual
    expect(AbilityManual).toBeDefined();
    expect(AbilityManual?.name).toBe('Test AbilityManual');
    expect(AbilityManual?.character).toBe('Test Character');
  });
});
