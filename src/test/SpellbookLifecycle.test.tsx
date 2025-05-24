import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useContext } from 'react';
import { AbilityManualsProvider, AbilityManualsContext } from '../context/AbilityManualsContext';

describe('AbilityManual Management Tests', () => {
  // Create a simple integration test that verifies the complete lifecycle 
  // of creating a AbilityManual, adding a spell, removing a spell, and deleting the AbilityManual
  
  test('full AbilityManual lifecycle', async () => {
    // Mock the localStorage
    const localStorageMock = (function() {
      let store = {};
      return {
        getItem: function(key) {
          return store[key] || null;
        },
        setItem: function(key, value) {
          store[key] = value.toString();
        },
        clear: function() {
          store = {};
        }
      };
    })();
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
    
    // Set up a test component to test the AbilityManual context
    const TestHook = () => {
      const context = useContext(AbilityManualsContext);
      return context;
    };
    
    // Step 1: Render the hook and verify initial state
    const { result } = renderHook(() => TestHook(), {
      wrapper: AbilityManualsProvider
    });
    
    // Mock crypto.randomUUID for predictable IDs
    const mockUUID = 'mock-AbilityManual-id';
    vi.stubGlobal('crypto', {
      randomUUID: () => mockUUID
    });
    
    // Verify initial state: empty AbilityManuals array
    expect(result.current.AbilityManuals).toEqual([]);
    
    // Step 2: Create a new AbilityManual
    act(() => {
      result.current.addAbilityManual({
        name: 'Test AbilityManual',
        character: 'Test Character',
        description: 'Test Description',
        abilities: []
      });
    });
    
    // Verify AbilityManual was created
    expect(result.current.AbilityManuals.length).toBe(1);
    expect(result.current.AbilityManuals[0].name).toBe('Test AbilityManual');
    expect(result.current.AbilityManuals[0].character).toBe('Test Character');
    expect(result.current.AbilityManuals[0].id).toBe(mockUUID);
    
    // Step 3: Add a spell to the AbilityManual
    const testSpell = {
      spellName: 'Fireball',
      spellClass: 'elementalism',
      school: 'pyromancy',
      complexity: 'medium-complexity',
      flare: 'medium-flare',
      range: '30 feet',
      target: 'burst',
      action: 'Standard',
      duration: 'instant',
      keywords: 'fire, damage',
      check: 'Intelligence + Spellcraft',
      skill: 'Spellcraft',
      focus: 'Wand',
      spellType: 'Attack',
      description: 'A ball of fire that explodes on impact',
      altDescription: null
    };
    
    act(() => {
      result.current.addSpellToAbilityManual(mockUUID, testSpell);
    });
    
    // Verify spell was added
    expect(result.current.AbilityManuals[0].abilities.length).toBe(1);
    expect(result.current.AbilityManuals[0].abilities[0].spellName).toBe('Fireball');
    
    // Step 4: Remove the spell from the AbilityManual
    act(() => {
      result.current.removeSpellFromAbilityManual(mockUUID, 'Fireball');
    });
    
    // Verify spell was removed
    expect(result.current.AbilityManuals[0].abilities.length).toBe(0);
    
    // Step 5: Delete the AbilityManual
    act(() => {
      result.current.deleteAbilityManual(mockUUID);
    });
    
    // Verify AbilityManual was deleted
    expect(result.current.AbilityManuals.length).toBe(0);
  });
});
