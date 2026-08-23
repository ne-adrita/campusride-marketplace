import { loadStripe } from '@stripe/stripe-js';

const getEnv = (key, fallback) => {
  try {
    const val = import.meta.env?.[key];
    return val !== undefined && val !== '' ? val : fallback;
  } catch { return fallback; }
};

const publishableKey = getEnv('VITE_STRIPE_PUBLISHABLE_KEY', 'pk_test_mock_51Hxxxxxxxxxxxxxxxxxxxxxx');
let stripePromise = null;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}

export const STRIPE_MOCK_ENABLED = !getEnv('VITE_STRIPE_PUBLISHABLE_KEY', '');
