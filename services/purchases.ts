import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { RevenueCatUI, PAYWALL_RESULT } from '@revenuecat/purchases-capacitor-ui';
import { Capacitor } from '@capacitor/core';

const API_KEY = 'test_ElwdNhaeYOrSbWkeyMSrHXASdpq';

/** The entitlement identifier configured in the RevenueCat dashboard. */
export const ENTITLEMENT_ID = 'PetCalm Pro';

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

/**
 * Configure the RevenueCat SDK. Must be called once on app start before
 * any other Purchases calls. Safe to call on web (no-ops).
 */
export async function initPurchases(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    const platform = Capacitor.getPlatform();
    if (platform === 'ios' || platform === 'android') {
      await Purchases.configure({ apiKey: API_KEY });
    }
  } catch (err) {
    console.warn('[RC] init failed:', err);
  }
}

// ---------------------------------------------------------------------------
// Entitlement check
// ---------------------------------------------------------------------------

/**
 * Returns true if the current user has an active "PetCalm Pro" entitlement.
 *
 * Browser dev override: run `localStorage.setItem('petcalm_dev_pro', 'true')`
 * in the console to simulate a Pro user during web development.
 */
export async function checkIsPro(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    return localStorage.getItem('petcalm_dev_pro') === 'true';
  }
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Native paywall (RevenueCatUI)
// ---------------------------------------------------------------------------

/**
 * Present the RevenueCat-managed paywall for the current offering.
 * Returns true if the user purchased or restored, false otherwise.
 * No-ops on web (returns false — use browser PaywallModal fallback instead).
 */
export async function presentPaywall(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const { result } = await RevenueCatUI.presentPaywall();
    switch (result) {
      case PAYWALL_RESULT.PURCHASED:
      case PAYWALL_RESULT.RESTORED:
        return true;
      case PAYWALL_RESULT.NOT_PRESENTED:
      case PAYWALL_RESULT.ERROR:
      case PAYWALL_RESULT.CANCELLED:
      default:
        return false;
    }
  } catch (err) {
    console.error('[RC] presentPaywall failed:', err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Customer Center (subscription management)
// ---------------------------------------------------------------------------

/**
 * Present the RevenueCat Customer Center sheet, which lets users manage,
 * cancel, or get support for their subscription without leaving the app.
 * No-ops on web.
 */
export async function presentCustomerCenter(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await RevenueCatUI.presentCustomerCenter();
  } catch (err) {
    console.error('[RC] presentCustomerCenter failed:', err);
  }
}

// ---------------------------------------------------------------------------
// Restore purchases
// ---------------------------------------------------------------------------

/**
 * Restore previous purchases for the current user.
 * Returns true if a "PetCalm Pro" entitlement was restored.
 */
export async function restorePurchases(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
  } catch {
    return false;
  }
}
