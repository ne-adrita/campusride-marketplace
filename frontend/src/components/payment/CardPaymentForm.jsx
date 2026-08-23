import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { sanitizeInput } from '../../utils/sanitize';

const CardPaymentForm = ({ onSubmit, loading }) => {
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = sanitizeInput(value);
    if (name === 'number') {
      val = val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    }
    if (name === 'expiry') {
      val = val.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5);
    }
    if (name === 'cvc') val = val.replace(/\D/g, '').slice(0, 4);
    setCard({ ...card, [name]: val });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const err = {};
    if (!card.number || card.number.replace(/\s/g, '').length < 16) err.number = 'Enter 16-digit card number';
    if (!card.expiry || !/^\d{2}\/\d{2}$/.test(card.expiry)) err.expiry = 'MM/YY required';
    if (!card.cvc || card.cvc.length < 3) err.cvc = 'CVC required';
    if (!card.name.trim()) err.name = 'Cardholder name required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(card);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input label="Cardholder Name" name="name" placeholder="John Doe" value={card.name} onChange={handleChange} error={errors.name} />
      <Input label="Card Number" name="number" placeholder="4242 4242 4242 4242" value={card.number} onChange={handleChange} error={errors.number} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Expiry (MM/YY)" name="expiry" placeholder="12/26" value={card.expiry} onChange={handleChange} error={errors.expiry} />
        <Input label="CVC" name="cvc" placeholder="123" value={card.cvc} onChange={handleChange} error={errors.cvc} />
      </div>
      <p className="text-xs text-navy-400">Demo: use <span className="font-mono font-semibold">4242 4242 4242 4242</span>, any future expiry, any 3-digit CVC.</p>
      <Button type="submit" className="w-full" isLoading={loading}>Pay with Card</Button>
    </form>
  );
};

CardPaymentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default CardPaymentForm;
