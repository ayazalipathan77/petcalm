import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  checkIsPro,
  initPurchases,
  presentPaywall,
  presentCustomerCenter,
} from '../services/purchases';
import { PaywallModal } from '../components/PaywallModal';

interface ProContextValue {
  isPro: boolean;
  isLoading: boolean;
  /** Open the paywall. Native: RevenueCat UI. Browser: custom modal preview. */
  openPaywall: () => void;
  /** Open the Customer Center (subscription management). Native only. */
  openCustomerCenter: () => void;
  refreshPro: () => Promise<void>;
}

const ProContext = createContext<ProContextValue>({
  isPro: false,
  isLoading: true,
  openPaywall: () => {},
  openCustomerCenter: () => {},
  refreshPro: async () => {},
});

export const usePro = () => useContext(ProContext);

export const ProProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Browser-only fallback modal (on native we use RevenueCatUI.presentPaywall)
  const [browserPaywallOpen, setBrowserPaywallOpen] = useState(false);

  const refreshPro = useCallback(async () => {
    const pro = await checkIsPro();
    setIsPro(pro);
  }, []);

  useEffect(() => {
    initPurchases()
      .then(() => refreshPro())
      .finally(() => setIsLoading(false));
  }, [refreshPro]);

  /** Opens the paywall. On native: uses RevenueCatUI native sheet. On web: shows in-app modal. */
  const openPaywall = useCallback(() => {
    if (Capacitor.isNativePlatform()) {
      // Fire-and-forget: native paywall handles its own lifecycle
      presentPaywall().then(purchased => {
        if (purchased) refreshPro();
      });
    } else {
      setBrowserPaywallOpen(true);
    }
  }, [refreshPro]);

  /** Opens the RevenueCat Customer Center for subscription management. Native only. */
  const openCustomerCenter = useCallback(() => {
    if (Capacitor.isNativePlatform()) {
      presentCustomerCenter();
    } else {
      // On browser, open Google Play subscriptions as fallback
      window.open('https://play.google.com/store/account/subscriptions', '_blank');
    }
  }, []);

  return (
    <ProContext.Provider value={{ isPro, isLoading, openPaywall, openCustomerCenter, refreshPro }}>
      {children}

      {/* Browser-only paywall preview (never shown on native) */}
      {browserPaywallOpen && (
        <PaywallModal
          onClose={() => setBrowserPaywallOpen(false)}
          onSuccess={async () => {
            await refreshPro();
            setBrowserPaywallOpen(false);
          }}
        />
      )}
    </ProContext.Provider>
  );
};
