import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { checkIsPro, initPurchases } from '../services/purchases';
import { PaywallModal } from '../components/PaywallModal';

interface ProContextValue {
  isPro: boolean;
  isLoading: boolean;
  openPaywall: () => void;
  refreshPro: () => Promise<void>;
}

const ProContext = createContext<ProContextValue>({
  isPro: false,
  isLoading: true,
  openPaywall: () => {},
  refreshPro: async () => {},
});

export const usePro = () => useContext(ProContext);

export const ProProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paywallOpen, setPaywallOpen] = useState(false);

  const refreshPro = useCallback(async () => {
    const pro = await checkIsPro();
    setIsPro(pro);
  }, []);

  useEffect(() => {
    initPurchases()
      .then(() => refreshPro())
      .finally(() => setIsLoading(false));
  }, [refreshPro]);

  return (
    <ProContext.Provider value={{ isPro, isLoading, openPaywall: () => setPaywallOpen(true), refreshPro }}>
      {children}
      {paywallOpen && (
        <PaywallModal
          onClose={() => setPaywallOpen(false)}
          onSuccess={async () => {
            await refreshPro();
            setPaywallOpen(false);
          }}
        />
      )}
    </ProContext.Provider>
  );
};
