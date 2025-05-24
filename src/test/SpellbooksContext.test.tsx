import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AbilityManualsProvider, AbilityManualsContext } from '../context/AbilityManualsContext';
import { useContext } from 'react';
import { Spell } from '../models/abilities.zod';
import '@testing-library/jest-dom';

// Test component to interact with the context
function TestComponent() {
  const {
    AbilityManuals,
    addAbilityManual,
    updateAbilityManual,
    deleteAbilityManual,
    getAbilityManual,
    addSpellToAbilityManual,
    removeSpellFromAbilityManual,
  } = useContext(AbilityManualsContext);

  return (
    <div>
      <div data-testid="AbilityManuals-count">{AbilityManuals.length}</div>
      <button
        data-testid="add-AbilityManual"
        onClick={() =>
          addAbilityManual({
            name: 'Test AbilityManual',
            character: 'Test Character',
            description: 'Test Description',
            abilities: [],
          })
        }
      >
        Add AbilityManual
      </button>
      {AbilityManuals.map((AbilityManual) => (
        <div key={AbilityManual.id} data-testid={`AbilityManual-${AbilityManual.id}`}>
          <h3 data-testid={`AbilityManual-name-${AbilityManual.id}`}>{AbilityManual.name}</h3>
          <p data-testid={`AbilityManual-character-${AbilityManual.id}`}>{AbilityManual.character}</p>
          <p data-testid={`AbilityManual-description-${AbilityManual.id}`}>{AbilityManual.description}</p>
          <div data-testid={`AbilityManual-abilities-count-${AbilityManual.id}`}>{AbilityManual.abilities.length}</div>
          <button
            data-testid={`add-spell-${AbilityManual.id}`}
            onClick={() =>
              addSpellToAbilityManual(AbilityManual.id, {
                spellName: 'Test Spell',
                spellClass: 'Wizard',
                school: 'Evocation',
                complexity: 'medium-complexity',
                flare: 'medium-flare',
                range: '30 feet',
                target: 'single-target',
                action: 'Standard',
                duration: 'Instant',
                keywords: 'fire, damage',
                check: 'Intelligence + Spellcraft',
                skill: 'Spellcraft',
                focus: 'Staff',
                spellType: 'Attack',
                description: 'A test spell that does damage',
                altDescription: null,
              })
            }
          >
            Add Spell
          </button>
          {AbilityManual.abilities.map((spell) => (
            <div key={spell.spellName} data-testid={`spell-${spell.spellName}`}>
              <span data-testid={`spell-name-${spell.spellName}`}>{spell.spellName}</span>
              <button
                data-testid={`remove-spell-${spell.spellName}`}
                onClick={() => removeSpellFromAbilityManual(AbilityManual.id, spell.spellName)}
              >
                Remove Spell
              </button>
            </div>
          ))}
          <button
            data-testid={`delete-AbilityManual-${AbilityManual.id}`}
            onClick={() => deleteAbilityManual(AbilityManual.id)}
          >
            Delete AbilityManual
          </button>
        </div>
      ))}
    </div>
  );
}

describe('AbilityManualsContext UI Operations', () => {
  // Clear localStorage before each test to ensure a clean state
  beforeEach(() => {
    window.localStorage.clear();
    
    // Mock crypto.randomUUID for consistent IDs in tests
    vi.stubGlobal('crypto', {
      randomUUID: () => 'test-uuid-123'
    });
  });

  test('should create a AbilityManual, add a spell, remove the spell, and delete the AbilityManual', async () => {
    // Render the test component with the AbilityManualsProvider
    render(
      <AbilityManualsProvider>
        <TestComponent />
      </AbilityManualsProvider>
    );

    // Verify initial state: no AbilityManuals
    expect(screen.getByTestId('AbilityManuals-count').textContent).toBe('0');

    // Step 1: Create a new AbilityManual
    act(() => {
      fireEvent.click(screen.getByTestId('add-AbilityManual'));
    });

    // Verify a AbilityManual was created
    await waitFor(() => {
      expect(screen.getByTestId('AbilityManuals-count').textContent).toBe('1');
    });

    // Since we know the ID is fixed by our mock, we can just use it directly
    const AbilityManualId = 'test-uuid-123';

    // Verify AbilityManual properties
    expect(screen.getByTestId(`AbilityManual-${AbilityManualId}`)).toBeInTheDocument();
    expect(screen.getByTestId(`AbilityManual-name-${AbilityManualId}`).textContent).toBe('Test AbilityManual');
    expect(screen.getByTestId(`AbilityManual-character-${AbilityManualId}`).textContent).toBe('Test Character');
    expect(screen.getByTestId(`AbilityManual-description-${AbilityManualId}`).textContent).toBe('Test Description');
    expect(screen.getByTestId(`AbilityManual-abilities-count-${AbilityManualId}`).textContent).toBe('0');

    // Step 2: Add a spell to the AbilityManual
    act(() => {
      fireEvent.click(screen.getByTestId(`add-spell-${AbilityManualId}`));
    });

    // Verify the spell was added
    await waitFor(() => {
      expect(screen.getByTestId(`AbilityManual-abilities-count-${AbilityManualId}`).textContent).toBe('1');
    });
    
    // Verify spell exists
    expect(screen.getByTestId('spell-Test Spell')).toBeInTheDocument();
    expect(screen.getByTestId('spell-name-Test Spell').textContent).toBe('Test Spell');

    // Step 3: Remove the spell from the AbilityManual
    act(() => {
      fireEvent.click(screen.getByTestId('remove-spell-Test Spell'));
    });

    // Verify the spell was removed
    await waitFor(() => {
      expect(screen.getByTestId(`AbilityManual-abilities-count-${AbilityManualId}`).textContent).toBe('0');
    });
    
    // Verify spell no longer exists
    expect(screen.queryByTestId('spell-Test Spell')).not.toBeInTheDocument();

    // Step 4: Delete the AbilityManual
    act(() => {
      fireEvent.click(screen.getByTestId(`delete-AbilityManual-${AbilityManualId}`));
    });

    // Verify the AbilityManual was deleted
    await waitFor(() => {
      expect(screen.getByTestId('AbilityManuals-count').textContent).toBe('0');
    });
    
    // Verify AbilityManual no longer exists
    expect(screen.queryByTestId(`AbilityManual-${AbilityManualId}`)).not.toBeInTheDocument();
  });
});
