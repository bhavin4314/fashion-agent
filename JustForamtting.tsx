// FeatureFlagContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of our active flags
export interface Flags {
  isStandardDateComponent: boolean;
}

// Define the context state structure
interface FeatureFlagContextType {
  flags: Flags;
  isLoading: boolean;
  updateFlagLocally: (flagName: keyof Flags, value: boolean) => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

const defaultFlags: Flags = {
  isStandardDateComponent: false,
};

// Local storage key helper
const STORAGE_PREFIX = 'ff_override_';

export const FeatureFlagProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [flags, setFlags] = useState<Flags>(defaultFlags);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to load flag values, checking both API and local overrides
  const loadFlags = async () => {
    try {
      // 1. Simulate an API fetch to load the base flags from the database table
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Imagine this response comes from your backend database configuration
      const apiResponse: Flags = {
        isStandardDateComponent: false, // Turned off in the database by default
      };

      // 2. Process and merge overrides from localStorage
      const mergedFlags = { ...apiResponse };
      
      Object.keys(defaultFlags).forEach((key) => {
        const flagKey = key as keyof Flags;
        const localOverride = localStorage.getItem(`${STORAGE_PREFIX}${flagKey}`);
        
        if (localOverride !== null) {
          // If a local override exists, prioritize it over the API value
          mergedFlags[flagKey] = localOverride === 'true';
        }
      });

      setFlags(mergedFlags);
    } catch (error) {
      console.error('Failed to load database feature flags:', error);
      setFlags(defaultFlags);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to let developers set overrides that persist locally
  const updateFlagLocally = (flagName: keyof Flags, value: boolean) => {
    localStorage.setItem(`${STORAGE_PREFIX}${flagName}`, String(value));
    // Reload flags to apply the new local configuration immediately
    loadFlags();
  };

  useEffect(() => {
      loadFlags();

      // Expose a helper function to the browser window for developers
      window.setFeatureFlag = (flagName: string, value: boolean) => {
        const typedFlagName = flagName as keyof Flags;
        if (typedFlagName in defaultFlags) {
          updateFlagLocally(typedFlagName, value);
          console.log(`%c[FeatureFlag] "${typedFlagName}" set to ${value}. Page reloaded!`, 'color: #10b981; font-weight: bold;');
        } else {
          const errorMsg = `Invalid feature flag name: "${flagName}". Valid keys: ${Object.keys(defaultFlags).join(', ')}`;
          console.error(`[FeatureFlag] ${errorMsg}`);
        }
      };

      // Clean up on unmount
      return () => {
        delete window.setFeatureFlag;
      };
    }, []);

  return (
    <FeatureFlagContext.Provider value={{ flags, isLoading, updateFlagLocally }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

// Custom hook for consuming our flags easily
export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
};

// Declare the helper on the global window interface for TypeScript compilation
declare global {
  interface Window {
    setFeatureFlag?: (flagName: keyof Flags, value: boolean) => void;
  }
}
