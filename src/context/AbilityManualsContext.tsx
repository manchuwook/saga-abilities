import { createContext, ReactNode, useMemo, useCallback } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import { Ability } from '../models/abilities.zod';

export interface AbilityManual {
  id: string;
  name: string;
  character: string;
  description: string;
  abilities: Ability[];
  createdAt: Date;
  updatedAt: Date;
}

interface AbilityManualsContextType {
  AbilityManuals: AbilityManual[];
  addAbilityManual: (AbilityManual: Omit<AbilityManual, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAbilityManual: (id: string, AbilityManual: Partial<Omit<AbilityManual, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteAbilityManual: (id: string) => void;
  getAbilityManual: (id: string) => AbilityManual | undefined;
  addAbilityToAbilityManual: (AbilityManualId: string, ability: Ability) => void;
  removeAbilityFromAbilityManual: (AbilityManualId: string, abilityName: string) => void;
}

export const AbilityManualsContext = createContext<AbilityManualsContextType>({
  AbilityManuals: [],
  addAbilityManual: () => { },
  updateAbilityManual: () => { },
  deleteAbilityManual: () => { },
  getAbilityManual: () => undefined,
  addAbilityToAbilityManual: () => { },
  removeAbilityFromAbilityManual: () => { },
});

export function AbilityManualsProvider({ children }: { children: ReactNode }) {
  const [AbilityManuals, setAbilityManuals] = useLocalStorage<AbilityManual[]>({
    key: 'saga-AbilityManuals',
    defaultValue: [],
    serialize: (value) => JSON.stringify(value, (key, value) => {
      if (key === 'createdAt' || key === 'updatedAt') {
        return value instanceof Date ? value.toISOString() : value;
      }
      return value;
    }), deserialize: (value) => {
      const parsed = JSON.parse(value ?? '[]');
      return parsed.map((abilityManual: Record<string, unknown>) => ({
        ...abilityManual,
        // Sort abilities alphabetically when loading from localStorage
        abilities: [...((abilityManual.abilities as Array<Ability>) || [])].sort((a, b) =>
          a.abilityName.localeCompare(b.abilityName)
        ),
        createdAt: new Date(abilityManual.createdAt as string),
        updatedAt: new Date(abilityManual.updatedAt as string),
      }));
    },
  });

  // ✅ Fixed: Use functional state updates to avoid dependency on AbilityManuals
  const addAbilityManual = useCallback((AbilityManual: Omit<AbilityManual, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newAbilityManual: AbilityManual = {
      ...AbilityManual,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    setAbilityManuals(prevAbilityManuals => [...prevAbilityManuals, newAbilityManual]);
  }, [setAbilityManuals]);

  const updateAbilityManual = useCallback((id: string, updatedFields: Partial<Omit<AbilityManual, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setAbilityManuals(prevAbilityManuals =>
      prevAbilityManuals.map((AbilityManual) =>
        AbilityManual.id === id
          ? {
            ...AbilityManual,
            ...updatedFields,
            updatedAt: new Date()
          }
          : AbilityManual
      )
    );
  }, [setAbilityManuals]);

  const deleteAbilityManual = useCallback((id: string) => {
    setAbilityManuals(prevAbilityManuals => prevAbilityManuals.filter((AbilityManual) => AbilityManual.id !== id));
  }, [setAbilityManuals]);

  const getAbilityManual = useCallback((id: string) => {
    return AbilityManuals.find((AbilityManual) => AbilityManual.id === id);
  }, [AbilityManuals]);

  const addAbilityToAbilityManual = useCallback((AbilityManualId: string, ability: Ability) => {
    setAbilityManuals(prevAbilityManuals =>
      prevAbilityManuals.map((AbilityManual) => {
        if (AbilityManual.id === AbilityManualId) {
          // Check if ability already exists in the AbilityManual
          const abilityExists = AbilityManual.abilities.some(
            (existingAbility) => existingAbility.abilityName === ability.abilityName
          );

          if (abilityExists) {
            return AbilityManual; // Don't add duplicate abilities
          }

          // Add ability and sort alphabetically by ability name
          const updatedAbilities = [...AbilityManual.abilities, ability].sort((a, b) =>
            a.abilityName.localeCompare(b.abilityName)
          );

          return {
            ...AbilityManual,
            abilities: updatedAbilities,
            updatedAt: new Date(),
          };
        }
        return AbilityManual;
      })
    );
  }, [setAbilityManuals]);

  const removeAbilityFromAbilityManual = useCallback((AbilityManualId: string, abilityName: string) => {
    setAbilityManuals(prevAbilityManuals =>
      prevAbilityManuals.map((AbilityManual) => {
        if (AbilityManual.id === AbilityManualId) {
          // Filter out the ability to remove and keep the alphabetical order
          const updatedAbilities = AbilityManual.abilities
            .filter((ability) => ability.abilityName !== abilityName)
            .sort((a, b) => a.abilityName.localeCompare(b.abilityName));

          return {
            ...AbilityManual,
            abilities: updatedAbilities,
            updatedAt: new Date(),
          };
        }
        return AbilityManual;
      })
    );
  }, [setAbilityManuals]);

  // ✅ Fixed: Only depend on AbilityManuals for the context value, not the callbacks
  const contextValue = useMemo(() => ({
    AbilityManuals,
    addAbilityManual,
    updateAbilityManual,
    deleteAbilityManual,
    getAbilityManual,
    addAbilityToAbilityManual,
    removeAbilityFromAbilityManual,
  }), [AbilityManuals, addAbilityManual, updateAbilityManual, deleteAbilityManual, getAbilityManual, addAbilityToAbilityManual, removeAbilityFromAbilityManual]);

  return (
    <AbilityManualsContext.Provider value={contextValue}>
      {children}
    </AbilityManualsContext.Provider>
  );
}