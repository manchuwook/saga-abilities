import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAbilityManuals } from '../hooks/useAbilityManuals';
import { AbilityManualsProvider } from '../context/AbilityManualsContext';
import { ReactNode } from 'react';

describe('useAbilityManuals Hook - Simple Coverage', () => {

  it('should provide the AbilityManuals context when used within provider', () => {
    // Setup wrapper with context provider
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AbilityManualsProvider>{children}</AbilityManualsProvider>
    );
    
    // Render hook with provider
    const { result } = renderHook(() => useAbilityManuals(), { wrapper });
    
    // Verify the hook returns the context
    expect(result.current).toBeDefined();
    expect(result.current.AbilityManuals).toBeDefined();
    expect(result.current.addAbilityManual).toBeDefined();
    expect(result.current.updateAbilityManual).toBeDefined();
    expect(result.current.deleteAbilityManual).toBeDefined();
    expect(result.current.getAbilityManual).toBeDefined();
    expect(result.current.addSpellToAbilityManual).toBeDefined();
    expect(result.current.removeSpellFromAbilityManual).toBeDefined();
  });
});
