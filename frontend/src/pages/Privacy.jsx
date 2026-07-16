import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="bg-white rounded-xl shadow-card p-8 space-y-4 text-gray-700">
          <p>Your privacy is important to us. This policy outlines how we collect, use, and protect your information.</p>
          <h3 className="font-semibold text-lg">Information We Collect</h3>
          <p>We collect your name, email address, student ID, and profile information when you create an account. We also collect data on your marketplace listings and ride sharing activity.</p>
          <h3 className="font-semibold text-lg">How We Use Your Information</h3>
          <p>Your information is used to verify your student status, facilitate transactions between users, and improve our platform.</p>
          <h3 className="font-semibold text-lg">Data Protection</h3>
          <p>We implement security measures to protect your personal data. Your password is encrypted and never stored in plain text.</p>
          <h3 className="font-semibold text-lg">Contact</h3>
          <p>If you have questions about this policy, please contact us through the platform.</p>
        </div>
        <div className="text-center mt-8">
          <Link to="/" className="text-primary-600 hover:text-primary-700">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
