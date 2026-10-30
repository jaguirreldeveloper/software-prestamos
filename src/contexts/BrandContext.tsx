import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface BrandConfig {
  appName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  company: string;
}

interface BrandContextType {
  brand: BrandConfig;
  updateBrand: (config: Partial<BrandConfig>) => void;
  resetBrand: () => void;
}

const defaultBrand: BrandConfig = {
  appName: 'Sistema de Préstamos',
  tagline: 'Gestión completa de amortización',
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6',
  logoUrl: '',
  contactEmail: 'soporte@prestamos.com',
  contactPhone: '+591 70000000',
  company: 'Mi Empresa',
};

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState<BrandConfig>(() => {
    const saved = localStorage.getItem('brandConfig');
    return saved ? JSON.parse(saved) : defaultBrand;
  });

  useEffect(() => {
    localStorage.setItem('brandConfig', JSON.stringify(brand));
    
    // Apply primary color to CSS variables
    document.documentElement.style.setProperty('--accent-primary', brand.primaryColor);
    document.documentElement.style.setProperty('--accent-secondary', brand.secondaryColor);
  }, [brand]);

  const updateBrand = (config: Partial<BrandConfig>) => {
    setBrand(prev => ({ ...prev, ...config }));
  };

  const resetBrand = () => {
    setBrand(defaultBrand);
    localStorage.removeItem('brandConfig');
  };

  return (
    <BrandContext.Provider value={{ brand, updateBrand, resetBrand }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within BrandProvider');
  }
  return context;
}
