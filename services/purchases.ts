import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

const ANDROID_KEY = import.meta.env.VITE_REVENUECAT_ANDROID_KEY || '';

export async function initPurchases(): Promise<void> {
  if (!Capacitor.isNativePlatform() || !ANDROID_KEY) return;
  try {
    await Purchases.setLogLevel({ level: LOG_LEVEL.ERROR });
    await Purchases.configure({ apiKey: ANDROID_KEY });
  } catch (err) {
    console.warn('RevenueCat init failed:', err);
  }
}

export async function checkIsPro(): Promise<boolean> {
  // Browser dev override: localStorage.setItem('petcalm_dev_pro', 'true')
  if (!Capacitor.isNativePlatform()) {
    return localStorage.getItem('petcalm_dev_pro') === 'true';
  }
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active['pro'] !== undefined;
  } catch {
    return false;
  }
}

export async function purchasePackageById(packageId: '$rc_monthly' | '$rc_annual'): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    alert('In-app purchases are only available on your Android device. Install the APK to test.');
    return false;
  }
  try {
    const { offerings } = await Purchases.getOfferings();
    const pkg = offerings.current?.availablePackages.find(p => p.identifier === packageId);
    if (!pkg) throw new Error(`Package ${packageId} not found in RevenueCat offerings`);
    await Purchases.purchasePackage({ aPackage: pkg });
    return true;
  } catch (err: any) {
    // User cancelled — not a real error
    if (err?.code === 'PURCHASE_CANCELLED' || err?.userCancelled) return false;
    console.error('Purchase failed:', err);
    return false;
  }
}

export async function restorePurchases(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    return customerInfo.entitlements.active['pro'] !== undefined;
  } catch {
    return false;
  }
}
