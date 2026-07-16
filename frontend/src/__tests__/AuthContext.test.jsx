import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with no user when not in demo mode', async () => {
    import.meta.env = { VITE_DEMO_MODE: 'false' };
    const { AuthProvider, useAuth } = await import('../context/AuthContext');
    let authValue;
    function TestComponent() {
      const auth = useAuth();
      authValue = auth;
      return <div data-testid="value">{String(auth.isAuthenticated)}</div>;
    }
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('value').textContent).toBe('false');
    });
  });
});
