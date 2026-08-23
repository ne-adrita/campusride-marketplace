import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getPaymentById } from '../services/paymentService';
import { formatBDT } from '../utils/currency';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaCheckCircle, FaReceipt } from 'react-icons/fa';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pid = searchParams.get('pid');
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pid) { setLoading(false); return; }
    (async () => {
      const { data } = await getPaymentById(pid);
      setPayment(data);
      setLoading(false);
    })();
  }, [pid]);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-navy-50 py-12">
      <div className="container-custom max-w-2xl">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-green-600 text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-navy-800">Payment Successful!</h1>
          <p className="text-navy-400 mt-2">Your payment has been confirmed. You will receive a confirmation message shortly.</p>

          {payment ? (
            <div className="mt-6 bg-navy-50 rounded-xl p-4 text-left space-y-2 text-sm">
              <div className="flex items-center space-x-2 font-semibold text-navy-700"><FaReceipt /><span>Receipt</span></div>
              <div className="flex justify-between"><span className="text-navy-400">Transaction ID</span><span className="font-mono font-medium">{payment.transactionId || payment.id}</span></div>
              <div className="flex justify-between"><span className="text-navy-400">Method</span><span className="font-medium capitalize">{payment.method} {payment.provider ? `(${payment.provider})` : ''}</span></div>
              <div className="flex justify-between"><span className="text-navy-400">Amount</span><span className="font-bold text-primary-600">{formatBDT(payment.bdtAmount || payment.amount)}</span></div>
              <div className="flex justify-between"><span className="text-navy-400">Status</span><span className="text-green-600 font-semibold">{payment.status}</span></div>
              {payment.phone && <div className="flex justify-between"><span className="text-navy-400">Phone</span><span className="font-medium">{payment.phone}</span></div>}
              <div className="flex justify-between"><span className="text-navy-400">Date</span><span>{new Date(payment.confirmedAt || payment.created).toLocaleString('en-BD')}</span></div>
            </div>
          ) : (
            <p className="text-sm text-navy-400 mt-6">Payment ID: {pid || '—'}</p>
          )}

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link to="/marketplace" className="btn-secondary text-center">Marketplace</Link>
            <Link to="/rides" className="btn-secondary text-center">Rides</Link>
            <Link to="/dashboard" className="btn-primary text-center">Dashboard</Link>
          </div>
          {type && id && (
            <div className="mt-4">
              <button onClick={() => navigate(type === 'product' ? `/product/${id}` : `/ride/${id}`)} className="text-sm text-primary-600 hover:underline">View {type}</button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
