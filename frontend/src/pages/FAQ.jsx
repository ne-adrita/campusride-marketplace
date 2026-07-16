import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';

const FAQ = () => {
  const faqs = [
    { q: 'How do I create an account?', a: 'Click "Get Started" on the landing page, fill in your details with a .edu email, and submit. Once verified, you can start using the platform.' },
    { q: 'How does ride sharing work?', a: 'You can offer a ride by providing your route details, or search for rides from other students heading the same direction.' },
    { q: 'Is it safe to buy/sell on campus?', a: 'All users are verified with their .edu emails. We recommend meeting in campus public areas for transactions.' },
    { q: 'How do I contact a seller or driver?', a: 'Use the in-app messaging system to communicate without sharing personal contact details.' },
    { q: 'What if I have an issue with a transaction?', a: 'Contact us through the platform support. We review all reported issues and take appropriate action.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Card key={i} className="p-6">
              <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/" className="text-primary-600 hover:text-primary-700">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
