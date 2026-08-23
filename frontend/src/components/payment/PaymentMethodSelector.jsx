import React from 'react';
import PropTypes from 'prop-types';
import { FaCreditCard, FaMobileAlt } from 'react-icons/fa';

const methods = [
  { id: 'card', name: 'Card', desc: 'Visa / Mastercard', icon: FaCreditCard, color: 'bg-navy-800', test: 'Card' },
  { id: 'bkash', name: 'bKash', desc: 'Mobile banking', icon: FaMobileAlt, color: 'bg-[#e2136e]', test: 'bKash' },
  { id: 'nagad', name: 'Nagad', desc: 'Mobile banking', icon: FaMobileAlt, color: 'bg-[#f47920]', test: 'Nagad' },
  { id: 'rocket', name: 'Rocket', desc: 'DBBL Mobile', icon: FaMobileAlt, color: 'bg-[#8a2be2]', test: 'Rocket' },
];

const PaymentMethodSelector = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {methods.map((m) => {
        const isActive = selected === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all flex items-center space-x-3 focus-visible:ring-2 focus-visible:ring-primary-500 ${
              isActive ? 'border-primary-500 bg-primary-50' : 'border-navy-100 bg-white hover:border-navy-200'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg ${m.color} flex items-center justify-center text-white`}>
              <m.icon size={16} />
            </div>
            <div>
              <p className="font-semibold text-sm text-navy-800">{m.name}</p>
              <p className="text-xs text-navy-400">{m.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

PaymentMethodSelector.propTypes = {
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default PaymentMethodSelector;
