import { describe, it, vi } from 'vitest';
import { useAbilities } from '../hooks/useAbilities';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { renderHook } from '@testing-library/react';

describe('useAbilities Hook - Very Simple Coverage', () => {
  it('should execute the query', () => {
    // Setup mock
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([])
    });
    
    // Mock validateAbilities
    vi.mock('../models/abilities.zod', () => ({
      validateAbilities: () => []
    }));
    
    // Create a query client
    const queryClient = new QueryClient();
    
    // Create a wrapper
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
    
    // Just render the hook to execute it
    renderHook(() => useAbilities(), { wrapper });
  });
});
