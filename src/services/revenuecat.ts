import Purchases, { PurchasesOffering, CustomerInfo } from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '';
const ENTITLEMENT_ID = process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT || 'premium_access';

let isConfigured = false;

export const RevenueCat = {
    async initialize(): Promise<void> {
        if (isConfigured) return;

        if (!API_KEY || API_KEY === 'placeholder_until_set') {
            console.warn('RevenueCat API key is missing or set to placeholder. Subscription features will be disabled.');
            return;
        }

        try {
            // Check if we are in Expo Go and native module is missing
            // react-native-purchases usually throws here if native module isn't linked
            Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

            if (Platform.OS === 'android') {
                Purchases.configure({ apiKey: API_KEY });
                isConfigured = true;
                console.log('RevenueCat initialized successfully');
            }
        } catch (e) {
            console.error('Failed to configure RevenueCat (Likely running in Expo Go without native modules):', e);
            isConfigured = false;
        }
    },

    async getOfferings(): Promise<PurchasesOffering | null> {
        if (!isConfigured) return null;
        try {
            const offerings = await Purchases.getOfferings();
            if (offerings.current !== null) {
                return offerings.current;
            }
            return null;
        } catch (e) {
            console.error('Error fetching offerings:', e);
            return null;
        }
    },

    async purchaseProduct(packageToBuy: any): Promise<boolean> {
        if (!isConfigured) return false;
        try {
            const { customerInfo } = await Purchases.purchasePackage(packageToBuy);
            return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
        } catch (e: any) {
            if (!e.userCancelled) {
                console.error('Error purchasing package:', e);
            }
            return false;
        }
    },

    async restorePurchases(): Promise<boolean> {
        if (!isConfigured) return false;
        try {
            const customerInfo = await Purchases.restorePurchases();
            return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
        } catch (e) {
            console.error('Error restoring purchases:', e);
            return false;
        }
    },

    async checkEntitlement(): Promise<boolean> {
        if (!isConfigured) return false;
        try {
            const customerInfo = await Purchases.getCustomerInfo();
            return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
        } catch (e) {
            console.error('Error checking entitlement:', e);
            return false;
        }
    },

    setCustomerInfoUpdateListener(callback: (customerInfo: any) => void) {
        if (!isConfigured) return;
        Purchases.addCustomerInfoUpdateListener(callback);
    },
};
