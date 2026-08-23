import { loadJSON, saveJSON, IS_PREVIEW } from '../data';
import { usdToBdt } from '../utils/currency';

const delay = () => new Promise(r => setTimeout(r, 800));

// BD mobile banking validation patterns
export const MOBILE_BANKING_CONFIG = {
  bkash: { name: 'bKash', prefix: '01', icon: 'Bk', color: 'bg-pink-600', placeholder: '01XXXXXXXXX' },
  nagad: { name: 'Nagad', prefix: '01', icon: 'Na', color: 'bg-orange-600', placeholder: '01XXXXXXXXX' },
  rocket: { name: 'Rocket', prefix: '01', icon: 'Ro', color: 'bg-purple-700', placeholder: '01XXXXXXXXX' },
};

function generatePaymentId() {
  return 'pay_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

function validateMobileNumber(phone) {
  return /^01[3-9]\d{8}$/.test(phone);
}

export async function createPaymentIntent({ amount, currency = 'BDT', itemId, itemType, method }) {
  try {
    if (IS_PREVIEW) {
      await delay();
      const payment = {
        id: generatePaymentId(),
        amount,
        bdtAmount: typeof amount === 'number' && currency === 'USD' ? usdToBdt(amount) : amount,
        currency,
        itemId,
        itemType, // 'product' or 'ride'
        method: method || 'card',
        status: 'requires_confirmation',
        clientSecret: 'pi_mock_secret_' + Math.random().toString(36).substr(2, 10),
        created: new Date().toISOString(),
      };
      const payments = loadJSON('payments', []);
      payments.unshift(payment);
      saveJSON('payments', payments);
      return { data: payment, error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.post('/payments/intent', { amount, currency, itemId, itemType, method });
    return { data: response.data, error: null };
  } catch (error) {
    console.error('createPaymentIntent error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to create payment intent';
    return { data: null, error: msg };
  }
}

export async function confirmCardPayment({ paymentId, cardDetails }) {
  try {
    if (IS_PREVIEW) {
      await delay();
      // Simulate Stripe validation
      if (!cardDetails || !cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 16) {
        return { data: null, error: 'Invalid card number' };
      }
      if (!cardDetails.expiry || !/^\d{2}\/\d{2,4}$/.test(cardDetails.expiry)) {
        return { data: null, error: 'Invalid expiry date (MM/YY)' };
      }
      if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
        return { data: null, error: 'Invalid CVC' };
      }
      const payments = loadJSON('payments', []);
      const idx = payments.findIndex(p => p.id === paymentId);
      if (idx === -1) return { data: null, error: 'Payment not found' };
      payments[idx].status = 'succeeded';
      payments[idx].confirmedAt = new Date().toISOString();
      payments[idx].cardLast4 = cardDetails.number.slice(-4);
      saveJSON('payments', payments);
      return { data: payments[idx], error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.post(`/payments/${paymentId}/confirm`, { cardDetails });
    return { data: response.data, error: null };
  } catch (error) {
    console.error('confirmCardPayment error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Card payment failed';
    return { data: null, error: msg };
  }
}

export async function processMobileBanking({ method, amount, phone, pin, itemId, itemType }) {
  try {
    if (!['bkash', 'nagad', 'rocket'].includes(method)) {
      return { data: null, error: 'Invalid payment method' };
    }
    if (!validateMobileNumber(phone)) {
      return { data: null, error: `Invalid ${MOBILE_BANKING_CONFIG[method].name} number. Use 11-digit BD number starting with 01` };
    }
    if (!pin || pin.length < 4) {
      return { data: null, error: 'PIN must be at least 4 digits' };
    }

    if (IS_PREVIEW) {
      await delay();
      // Simulate API call - 90% success rate for demo (allow test pin 1234 to always succeed)
      if (pin === '0000') {
        return { data: null, error: 'Incorrect PIN. Try 1234 for demo.' };
      }
      const payment = {
        id: generatePaymentId(),
        amount,
        bdtAmount: amount,
        currency: 'BDT',
        itemId,
        itemType,
        method,
        provider: MOBILE_BANKING_CONFIG[method].name,
        phone,
        status: 'succeeded',
        transactionId: `${method.toUpperCase()}${Date.now().toString().slice(-8)}`,
        created: new Date().toISOString(),
        confirmedAt: new Date().toISOString(),
      };
      const payments = loadJSON('payments', []);
      payments.unshift(payment);
      saveJSON('payments', payments);
      return { data: payment, error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.post('/payments/mobile', { method, amount, phone, pin, itemId, itemType });
    return { data: response.data, error: null };
  } catch (error) {
    console.error('processMobileBanking error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Mobile banking payment failed';
    return { data: null, error: msg };
  }
}

export async function getPayments() {
  try {
    if (IS_PREVIEW) {
      await delay();
      const payments = loadJSON('payments', []);
      return { data: payments, error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.get('/payments');
    return { data: response.data, error: null };
  } catch (error) {
    console.error('getPayments error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to fetch payments';
    return { data: [], error: msg };
  }
}

export async function getPaymentById(id) {
  try {
    if (IS_PREVIEW) {
      await delay();
      const payments = loadJSON('payments', []);
      const payment = payments.find(p => p.id === id);
      if (!payment) return { data: null, error: 'Payment not found' };
      return { data: payment, error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.get(`/payments/${id}`);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('getPaymentById error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to fetch payment';
    return { data: null, error: msg };
  }
}
