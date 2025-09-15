import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGeolocation } from '../useGeolocation';

describe('useGeolocation', () => {
  it('should return hook interface', () => {
    const { result } = renderHook(() => useGeolocation());
    
    expect(result.current).toHaveProperty('position');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('refreshLocation');
    expect(typeof result.current.refreshLocation).toBe('function');
  });

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useGeolocation());
    
    expect(result.current.position).toBeNull();
    expect(result.current.error).toBeNull();
    expect(typeof result.current.loading).toBe('boolean');
  });
});
