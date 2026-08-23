import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { sanitizeInput } from '../../utils/sanitize';
import { MOBILE_BANKING_CONFIG } from '../../services/paymentService';

const MobileBankingForm = ({ method, onSubmit, loading }) => {
  const config = MOBILE_BANKING_CONFIG[method];
  const [form, setForm] = useState({ phone: '', pin: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = sanitizeInput(value);
    if (name === 'phone') val = val.replace(/\D/g, '').slice(0, 11);
    if (name === 'pin') val = val.replace(/\D/g, '').slice(0, 6);
    setForm({ ...form, [name]: val });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const err = {};
    if (!/^01[3-9]\d{8}$/.test(form.phone)) err.phone = 'Enter valid 11-digit BD number (01XXXXXXXXX)';
    if (!form.pin || form.pin.length < 4) err.pin = 'PIN must be 4-6 digits';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ phone: form.phone, pin: form.pin });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className={`p-3 rounded-lg ${config.color} text-white text-sm font-semibold flex items-center space-x-2`}>
        <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-xs">{config.icon}</span>
        <span>Pay with {config.name}</span>
      </div>
      <Input label={`${config.name} Number`} name="phone" placeholder={config.placeholder} value={form.phone} onChange={handleChange} error={errors.phone} />
      <Input label="PIN" name="pin" type="password" placeholder="Enter PIN" value={form.pin} onChange={handleChange} error={errors.pin} />
      <p className="text-xs text-navy-400">Demo: use any valid number + PIN <span className="font-mono font-semibold">1234</span> (0000 fails).</p>
      <Button type="submit" className="w-full" isLoading={loading}>Pay with {config.name}</Button>
    </form>
  );
};

MobileBankingForm.propTypes = {
  method: PropTypes.oneOf(['bkash', 'nagad', 'rocket']).isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default MobileBankingForm;
