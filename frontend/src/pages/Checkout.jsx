import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { getRideById, bookRide } from '../services/rideService';
import { createPaymentIntent, confirmCardPayment, processMobileBanking } from '../services/paymentService';
import { formatPrice, usdToBdt } from '../utils/currency';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';
import CardPaymentForm from '../components/payment/CardPaymentForm';
import MobileBankingForm from '../components/payment/MobileBankingForm';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaLock } from 'react-icons/fa';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get('type'); // product | ride
  const id = searchParams.get('id');
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [method, setMethod] = useState('card');
  const [paymentIntent, setPaymentIntent] = useState(null);

  const isProduct = type === 'product';
  const isRide = type === 'ride';

  useEffect(() => {
    if (!type || !id) {
      toast.error('Invalid checkout link');
      navigate('/marketplace');
      return;
    }
    fetchItem();
  }, [type, id]);

  const fetchItem = async () => {
    setLoading(true);
    try {
      let res;
      if (isProduct) res = await getProductById(id);
      else if (isRide) res = await getRideById(id);
      else { toast.error('Unknown item type'); navigate('/'); return; }

      if (res.error || !res.data) {
        toast.error(res.error || 'Item not found');
        navigate(isProduct ? '/marketplace' : '/rides');
        return;
      }
      setItem(res.data);
      // create payment intent preview
      const amountUSD = isProduct ? res.data.price : res.data.fare_per_seat;
      const { data: intent, error } = await createPaymentIntent({
        amount: amountUSD,
        currency: 'USD',
        itemId: id,
        itemType: type,
        method: 'card',
      });
      if (error) console.error(error);
      if (intent) setPaymentIntent(intent);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load item');
    } finally { setLoading(false); }
  };

  const amountUSD = item ? (isProduct ? item.price : item.fare_per_seat) : 0;
  const amountBDT = usdToBdt(amountUSD);

  const handleCardSubmit = async (cardDetails) => {
    if (!paymentIntent) { toast.error('Payment not initialized'); return; }
    setProcessing(true);
    const tId = toast.loading('Processing card payment...');
    const { data, error } = await confirmCardPayment({ paymentId: paymentIntent.id, cardDetails });
    toast.dismiss(tId);
    if (error) {
      toast.error(error);
      setProcessing(false);
      return;
    }
    toast.success('Payment successful!');
    if (isRide) {
      const { error: bookErr } = await bookRide(id, 1);
      if (bookErr) toast.error(bookErr);
    }
    navigate(`/payment/success?pid=${data.id}&type=${type}&id=${id}`);
    setProcessing(false);
  };

  const handleMobileSubmit = async ({ phone, pin }) => {
    setProcessing(true);
    const tId = toast.loading(`Processing ${method} payment...`);
    const { data, error } = await processMobileBanking({
      method,
      amount: amountBDT,
      phone,
      pin,
      itemId: id,
      itemType: type,
    });
    toast.dismiss(tId);
    if (error) {
      toast.error(error);
      setProcessing(false);
      return;
    }
    toast.success(`Paid via ${data.provider} • ${data.transactionId}`);
    if (isRide) {
      const { error: bookErr } = await bookRide(id, 1);
      if (bookErr) toast.error(bookErr);
    }
    navigate(`/payment/success?pid=${data.id}&type=${type}&id=${id}`);
    setProcessing(false);
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!item) return <div className="container-custom py-8"><div className="surface-card p-8 text-center">Item not found</div></div>;

  return (
    <div className="min-h-screen bg-navy-50 py-8">
      <div className="container-custom max-w-5xl">
        <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-sm text-navy-600 hover:text-primary-600 mb-6">
          <FaArrowLeft size={12} /><span>Back</span>
        </button>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="font-bold text-navy-800 mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-navy-400">{isProduct ? 'Product' : 'Ride'}</p>
                  <p className="font-semibold text-navy-800">{isProduct ? item.title : `${item.origin} → ${item.destination}`}</p>
                  {isProduct && <p className="text-xs text-navy-400">{item.location} • {item.condition}</p>}
                  {isRide && <p className="text-xs text-navy-400">{item.vehicle_details} • {new Date(item.date_time).toLocaleString()}</p>}
                </div>
                <div className="border-t border-navy-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-navy-400">Subtotal</span><span className="font-medium">{formatPrice(amountUSD)}</span></div>
                  <div className="flex justify-between"><span className="text-navy-400">Fees</span><span className="font-medium">{formatPrice(0)}</span></div>
                  <div className="flex justify-between text-lg font-bold border-t border-navy-100 pt-2"><span>Total (BDT)</span><span className="text-primary-600">{formatPrice(amountUSD)}</span></div>
                  <p className="text-xs text-navy-400">{amountUSD} USD × 120 = {amountBDT.toLocaleString('en-BD')} BDT</p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-navy-400 bg-navy-50 p-3 rounded-lg">
                  <FaLock className="text-green-600" /><span>Secure payment • Preview mode (no real charge)</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Payment */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <h2 className="font-bold text-navy-800 mb-2">Payment Method</h2>
              <p className="text-sm text-navy-400 mb-4">Choose bKash, Nagad, Rocket or Card</p>

              <PaymentMethodSelector selected={method} onSelect={setMethod} />

              <div className="mt-6">
                {method === 'card' ? (
                  <CardPaymentForm onSubmit={handleCardSubmit} loading={processing} />
                ) : (
                  <MobileBankingForm method={method} onSubmit={handleMobileSubmit} loading={processing} />
                )}
              </div>

              <div className="mt-6 text-center">
                <Link to={isProduct ? `/product/${id}` : `/ride/${id}`} className="text-sm text-navy-400 hover:text-primary-600">Cancel and go back</Link>
              </div>
            </Card>

            <div className="mt-4 text-xs text-navy-400 text-center">
              By paying you agree to campus marketplace terms. Mock payments only — no real money moved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
