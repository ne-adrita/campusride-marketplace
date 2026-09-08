import Payment from '../models/Payment.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// This is a MOCK payment gateway (no Stripe / bKash calls happen here) so you
// can see the request/response shape a real integration would need without
// wiring up real credentials. Swap the bodies of confirmCardPayment /
// processMobileBanking for real SDK calls later.

const MOBILE_PROVIDERS = { bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket' };

// POST /api/payments/intent  (auth)
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency = 'BDT', itemId, itemType, method } = req.body;
  if (amount === undefined || !itemId || !itemType) {
    return res.status(400).json({ message: 'amount, itemId and itemType are required' });
  }

  const payment = await Payment.create({
    user_id: req.user.user_id,
    amount,
    currency,
    itemId,
    itemType,
    method: method || 'card',
    status: 'requires_confirmation',
    clientSecret: 'pi_mock_secret_' + Math.random().toString(36).slice(2, 12),
  });
  res.status(201).json(payment);
});

// POST /api/payments/:paymentId/confirm  (auth) - card flow
export const confirmCardPayment = asyncHandler(async (req, res) => {
  const { cardDetails } = req.body;
  if (!cardDetails || !cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 16) {
    return res.status(400).json({ message: 'Invalid card number' });
  }
  if (!cardDetails.expiry || !/^\d{2}\/\d{2,4}$/.test(cardDetails.expiry)) {
    return res.status(400).json({ message: 'Invalid expiry date (MM/YY)' });
  }
  if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
    return res.status(400).json({ message: 'Invalid CVC' });
  }

  const payment = await Payment.findOne({ _id: req.params.paymentId, user_id: req.user.user_id });
  if (!payment) return res.status(404).json({ message: 'Payment not found' });

  payment.status = 'succeeded';
  payment.confirmedAt = new Date();
  payment.cardLast4 = cardDetails.number.slice(-4);
  await payment.save();
  res.json(payment);
});

// POST /api/payments/mobile  (auth) - bKash/Nagad/Rocket flow
export const processMobileBanking = asyncHandler(async (req, res) => {
  const { method, amount, phone, pin, itemId, itemType } = req.body;

  if (!MOBILE_PROVIDERS[method]) {
    return res.status(400).json({ message: 'Invalid payment method' });
  }
  if (!/^01[3-9]\d{8}$/.test(phone || '')) {
    return res.status(400).json({ message: `Invalid ${MOBILE_PROVIDERS[method]} number. Use 11-digit BD number starting with 01` });
  }
  if (!pin || pin.length < 4) {
    return res.status(400).json({ message: 'PIN must be at least 4 digits' });
  }
  if (pin === '0000') {
    return res.status(400).json({ message: 'Incorrect PIN. Try 1234 for demo.' });
  }

  const payment = await Payment.create({
    user_id: req.user.user_id,
    amount,
    bdtAmount: amount,
    currency: 'BDT',
    itemId,
    itemType,
    method,
    provider: MOBILE_PROVIDERS[method],
    phone,
    status: 'succeeded',
    transactionId: `${method.toUpperCase()}${Date.now().toString().slice(-8)}`,
    confirmedAt: new Date(),
  });
  res.status(201).json(payment);
});

// GET /api/payments  (auth)
export const getPayments = asyncHandler(async (req, res) => {
  res.json(await Payment.find({ user_id: req.user.user_id }).sort({ created: -1 }));
});

// GET /api/payments/:id  (auth)
export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ _id: req.params.id, user_id: req.user.user_id });
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  res.json(payment);
});
