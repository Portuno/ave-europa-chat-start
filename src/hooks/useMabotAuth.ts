import { useState, useEffect, useCallback } from 'react';
import mabotAuthService from '@/lib/services/mabotAuth';

export const useMabotAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = useCallback(() => {
    const authenticated = mabotAuthService.isAuthenticated();
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      await mabotAuthService.login(credentials);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    mabotAuthService.logout();
    setIsAuthenticated(false);
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      await mabotAuthService.ensureValidToken();
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      setIsAuthenticated(false);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication refresh failed' 
      };
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();

    // Listen for storage changes (in case tokens are cleared elsewhere)
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkAuthStatus]);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshAuth,
    checkAuthStatus,
  };
}; 